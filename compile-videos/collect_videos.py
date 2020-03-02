from pprint import pprint
from pymongo import MongoClient
from download_video import download_video
from mongo import get_unused_videos, set_used_video, set_used_videos
from json_ops import write_json
from env import is_prod
import datetime
from files import create_file_and_dir
from random import randrange

VIDEO_LENGTH = 60 * 10

# Check if output dir exists and create it if not
collections_path = "../../collections/" if is_prod() else "../../dev_collections/"

# Collect videos from db to fill a video of length
print("Start collecting videos from DB")
collection_length = 0
success_vids = []
failed_vids = []
for vid in get_unused_videos():
  pprint("Starting %s" % vid['id'])
  res = download_video(vid['hls_url'], vid['id'])
  if res:
    success_vids.append(vid)
    collection_length += vid['media']['end'] - vid['media']['start']
  else:
    failed_vids.append(vid['id'])
  if collection_length > VIDEO_LENGTH:
    col_name = datetime.datetime.now().strftime("%d_%b_%Y_%H_%M_%S") + "_" + str(randrange(10000))
    out_filename = col_name + ".json"
    create_file_and_dir(collections_path, out_filename)
    vid_keys = ["id", "media", "title"]
    out_vids = map(lambda vid: { key: vid[key] for key in vid_keys }, success_vids)
    collection = {
      "id": col_name,
      "length": collection_length,
      "videos": list(out_vids)
    }
    # pprint(collection)
    write_json(collections_path + out_filename, collection)
    set_used_videos(list(map(lambda vid: vid["id"], success_vids)))
    print("Written collection %s" % col_name)
    success_vids = []
    collection_length = 0

print("Failed to download:") 
pprint(failed_vids)

print("All done") 
