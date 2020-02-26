from os import environ

if "PROD" in environ:
  prod = True
else:
  prod = False
print("is prod: ", prod)

def is_prod():
  return prod

if __name__ == "__main__":
  print(is_prod())