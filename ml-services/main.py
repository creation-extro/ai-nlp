from dotenv import load_dotenv
load_dotenv() 


import whisper_timestamped as whisper
import os, sys, pymongo, random, re
import static_ffmpeg

try:
    static_ffmpeg.add_paths()
except Exception:
    pass

try:
    from moviepy.editor import VideoFileClip
except ImportError:
    from moviepy.video.io.VideoFileClip import VideoFileClip


# ================= CONFIG =================
MONGO_URI = os.getenv("MONGO_URI")

VIDEO_ID = "arrays_lecture_01"
DB_NAME = "video_learning"
COLLECTION_NAME = "quizzes"
# =========================================


# --------- NLP HELPERS ----------
def split_sentences(text):
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return [s for s in sentences if len(s.split()) >= 6]


def extract_phrases(sentence):
    words = re.findall(r"[a-zA-Z]{4,}", sentence)
    return list(dict.fromkeys(words))  # unique, ordered


def distort_sentence(sentence, phrases):
    distorted = sentence
    if phrases:
        replace_word = random.choice(phrases)
        distorted = distorted.replace(replace_word, random.choice(phrases), 1)

    # randomly drop part of sentence
    words = distorted.split()
    if len(words) > 6:
        cut = random.randint(2, len(words) - 2)
        distorted = " ".join(words[:cut])

    return distorted.strip()


# --------- QUIZ GENERATOR ----------
def generate_smart_question(segment_text):
    sentences = split_sentences(segment_text)

    if not sentences:
        return None, None

    # pick factual sentence
    correct_sentence = random.choice(sentences)
    phrases = extract_phrases(correct_sentence)

    if len(phrases) < 2:
        return None, None

    # mask one phrase → question
    masked_phrase = random.choice(phrases)
    question = correct_sentence.replace(masked_phrase, "_____")

    # correct option = real phrase
    correct_option = masked_phrase

    # wrong options = distorted phrases
    wrong_options = set()
    while len(wrong_options) < 3:
        fake = random.choice(phrases)
        if fake != correct_option:
            wrong_options.add(fake)

    options = [{"text": correct_option, "is_correct": True}]
    options += [{"text": w, "is_correct": False} for w in wrong_options]

    random.shuffle(options)
    return question.strip(), options


# --------- TRANSCRIPTION ----------
def get_transcript_and_data(video_path):
    if not os.path.exists(video_path):
        return [], 0

    temp_audio = "temp_audio.mp3"

    try:
        with VideoFileClip(video_path) as video:
            duration = video.duration
            video.audio.write_audiofile(temp_audio, logger=None)

        model = whisper.load_model("small")
        result = whisper.transcribe(model, temp_audio, language="en")

        os.remove(temp_audio)

        segments = [
            {
                "start": int(seg["start"]),
                "text": seg["text"].strip()
            }
            for seg in result.get("segments", [])
            if len(seg.get("text", "")) > 20
        ]

        return segments, duration

    except Exception as e:
        print("❌ Error:", e)
        return [], 0


# --------- MAIN ----------
if __name__ == "__main__":
    input_path = sys.argv[1] if len(sys.argv) > 1 else "arrays.mp4"
    video_path = os.path.abspath(input_path)

    segments, duration = get_transcript_and_data(video_path)

    if not segments:
        print("❌ No usable transcript")
        sys.exit(0)

    quizzes = []

    for target in [duration * 0.4, duration * 0.85]:
        seg = min(segments, key=lambda s: abs(s["start"] - target))
        q, opts = generate_smart_question(seg["text"])

        if q and opts:
            quizzes.append({
                "videoId": VIDEO_ID,
                "trigger_time_sec": seg["start"],
                "question": q,
                "options": opts
            })

    client = pymongo.MongoClient(MONGO_URI)
    col = client[DB_NAME][COLLECTION_NAME]

    col.delete_many({"videoId": VIDEO_ID})
    col.insert_many(quizzes)

    print("🚀 SUCCESS: Fully dynamic sentence-derived quizzes created")
