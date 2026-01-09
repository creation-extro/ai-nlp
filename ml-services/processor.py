import pymongo

def upload_to_mongodb(quiz_list, video_id):
    # Connect to the same DB your Node.js app uses
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["video_learning"] # Matches your MERN DB name
    collection = db["quizzes"]
    
    # Clean old quizzes for this video before uploading new ones
    collection.delete_many({"videoId": video_id})
    
    # Add the videoId to each quiz object
    for quiz in quiz_list:
        quiz["videoId"] = video_id
        
    if quiz_list:
        collection.insert_many(quiz_list)
        print(f"✅ Success: {len(quiz_list)} AI quizzes injected into MERN database!")
    else:
        print("❌ No quizzes generated to upload.")