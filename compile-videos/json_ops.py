from pprint import pprint
import json

def write_json(filename, data):
  with open(filename, 'w') as outfile:
    json.dump(data, outfile)

def read_json(filename):
  with open(filename) as json_file:
    return json.load(json_file)

if __name__ == "__main__":
  data = {
    "test": "testme",
    "test again": 123,
    "one more": [1,2,3]
  }
  write_json("test.json", data)
  pprint(read_json("test.json"))