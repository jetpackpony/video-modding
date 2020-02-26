from pprint import pprint
from pymongo import MongoClient
from download_video import download_video
from mongo import get_unused_videos, set_used_video
from json_ops import write_json
from env import is_prod
import datetime
from files import create_file_and_dir


VIDEO_LENGTH = 10 * 60

# Check if output dir exists and create it if not
collections_path = "../collections/" if is_prod() else "../dev_collections/"
col_name = datetime.datetime.now().strftime("%d_%b_%Y_%H_%M_%S")
out_filename = col_name + ".json"
create_file_and_dir(collections_path, out_filename)

# Collect videos from db to fill a video of length
print("Start collecting videos from DB")
length = 0
chosen_vids = []
for vid in get_unused_videos():
  length += vid['media']['end'] - vid['media']['start']
  chosen_vids.append(vid)
  if length > VIDEO_LENGTH:
    break

# Download collected videos and mark them as used
print("Start downloading videos")
success_vids = []
failed_vids = []
for vid in chosen_vids:
  pprint("Starting %s" % vid['id'])
  res = download_video(vid['hls_url'], vid['id'])
  if res:
    set_used_video(vid['id'])
    success_vids.append(vid)
  else:
    failed_vids.append(vid['id'])

print("Failed to download:") 
pprint(failed_vids)

# Select info from videos and save them as collection
print("Start writing output")
vid_keys = ["id", "media", "title"]
out_vids = map(lambda vid: { key: vid[key] for key in vid_keys }, success_vids)
collection = {
  "id": col_name,
  "length": VIDEO_LENGTH,
  "videos": list(out_vids)
}
# pprint(collection)
write_json(collections_path + out_filename, collection)
