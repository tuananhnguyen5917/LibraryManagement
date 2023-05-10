import requests
from bs4 import BeautifulSoup


resp = requests.get('https://cachep.vn/collections/tieu-su-hoi-ky')
soup = BeautifulSoup(resp.content, "html.parser")

def getTitle():
    head = soup.findAll('head')
    for t in head:
        return t.find('title').text

getTitle()

titles = soup.findAll('div', class_='product-img')

links = [link.find('a').find('img') for link in titles]

f = open('link.txt', 'a')

title = getTitle()

while 'A' >= title[0] or title[0] >= 'Z':
    title = title[1::]

while 'a' >= title[len(title) - 1] or title[len(title) - 1] >= 'z':
    title = title[:len(title)-1:]

def getDoc():
    for link in links:
        name = link.get('alt')
        content = link.get('src')
        dict = {"type": title, "name": name, "content": "https:" + content}

        
        f.write(str(dict).replace("'", "\""))
        f.write(",\n")

getDoc()

f.close()