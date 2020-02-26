from pprint import pprint
from pymongo import MongoClient
from env import is_prod
from dotenv import load_dotenv
load_dotenv()
import os

client = MongoClient(os.getenv("MONGO_URL"), retryWrites=False)
db = client['video-modding']
col_name = "redditVideos" if is_prod() else "DEVredditVideos"
vids_col = db[col_name]

def get_vids_by_ids(ids):
  return vids_col.find({ "id": { "$in": ids }})

def get_unused_videos():
  return vids_col.find({ "usedInVideo": None })

def set_used_video(id):
  return vids_col.update_one({ "id": id }, { "$set": { "usedInVideo": True } }, upsert=True)

if __name__ == "__main__":
  for vid in get_vids_by_ids(["t3_f4wg9b", "t3_f5fin2", "t3_f5h6tw", "t3_f5hzeb"]):
    pprint(vid['media'])
