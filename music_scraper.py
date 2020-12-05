from urllib import request
import time
import random

input = [
    "Music_Jelly_Level.ogg,https://static.wikia.nocookie.net/candy-crush-saga/images/a/ad/Music_Jelly_Level.ogg/revision/latest?cb=20150527135934",
    "Music_Ingredients_Level.ogg,https://static.wikia.nocookie.net/candy-crush-saga/images/d/d5/Music_Ingredients_Level.ogg/revision/latest?cb=20150527140000",
    "Music_Timed_Level.ogg,https://static.wikia.nocookie.net/candy-crush-saga/images/0/08/Music_Timed_Level.ogg/revision/latest?cb=20150527140026",
    "Music_Candy_Order_Level.ogg,https://static.wikia.nocookie.net/candy-crush-saga/images/e/e8/Music_Candy_Order_Level.ogg/revision/latest?cb=20150527140046",
    "Mixed_type_music.ogg,https://static.wikia.nocookie.net/candy-crush-saga/images/7/73/Mixed_type_music.ogg/revision/latest?cb=20160420175528",
    "Music_Level_Select_(Reality).ogg,https://static.wikia.nocookie.net/candy-crush-saga/images/c/c7/Music_Level_Select_%28Reality%29.ogg/revision/latest?cb=20150527140524",
    "Music_Level_Failed.ogg,https://static.wikia.nocookie.net/candy-crush-saga/images/7/7f/Music_Level_Failed.ogg/revision/latest?cb=20150527140109",
    "Music_Level_Completed.ogg,https://static.wikia.nocookie.net/candy-crush-saga/images/7/7e/Music_Level_Completed.ogg/revision/latest?cb=20150527140127",
    "Music_Chapter_Theme.ogg,https://static.wikia.nocookie.net/candy-crush-saga/images/f/f8/Music_Chapter_Theme.ogg/revision/latest?cb=20170209062024",
    "Music_Level_Select_(Dreamworld).ogg,https://static.wikia.nocookie.net/candy-crush-saga/images/5/5a/Music_Level_Select_%28Dreamworld%29.ogg/revision/latest?cb=20150527140146",
    "Music_Levels_(Dreamworld).ogg,https://static.wikia.nocookie.net/candy-crush-saga/images/b/b8/Music_Levels_%28Dreamworld%29.ogg/revision/latest?cb=20150527140207",
    "Music_Moon_Struck_(Dreamworld).ogg,https://static.wikia.nocookie.net/candy-crush-saga/images/6/64/Music_Moon_Struck_%28Dreamworld%29.ogg/revision/latest?cb=20150527140822",
    "Music_Tutorial_(Dreamworld).ogg,https://static.wikia.nocookie.net/candy-crush-saga/images/e/e6/Music_Tutorial_%28Dreamworld%29.ogg/revision/latest?cb=20150527140248",
    "Music_party_candies.ogg,https://static.wikia.nocookie.net/candy-crush-saga/images/1/17/Music_party_candies.ogg/revision/latest?cb=20190705115739"
]


obs = input


for o in obs:
    title, src = o.split(',')
    http_response = request.urlopen(src)

    print("downloading: " + title)
    
    f = open('music/' + title, 'wb')
    f.write(http_response.read())
    f.close()

    # sleeping to prevent being blocked from downloading
    time.sleep(random.randint(1, 15) / 10)

print("done...")