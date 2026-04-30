from lxml import etree
html = '''
<html>
<body>
    <div class="list">
        <div class="item"><span class="name">商品A</span><span class="price">50</span></div>
        <div class="item"><span class="name">商品B</span><span class="price">75</span></div>
        <div class="item"><span class="name">商品C</span><span class="price">120</span></div>
    </div>
</body>
</html>
'''
tree = etree.HTML(html)
# 找所有 class="item" 的 div
items = tree.xpath('//div[@class="item"]')
for item in items:
    name = item.xpath('.//span[@class="name"]/text()')[0]
    price = item.xpath('.//span[@class="price"]/text()')[0]
    print(f"{name}: {price}")

