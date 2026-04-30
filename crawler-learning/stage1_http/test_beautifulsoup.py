from bs4 import BeautifulSoup
html = '''
<html>
<body>
    <div class="product">
        <h3 class="title">Python书籍</h3>
        <span class="price">99.00</span>
    </div>
</body>
</html>
'''
soup = BeautifulSoup(html, 'lxml')
# CSS 选择器：找 class="title" 的元素
print(soup)
title = soup.select_one('.title').text
price = soup.select_one('.price').text
print(f"标题: {title}")
print(f"价格: {price}")
