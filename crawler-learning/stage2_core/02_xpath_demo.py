from lxml import etree

html = """
<html>
<body>
    <div class="products">
        <div class="item">
            <span class="name">商品A</span>
            <span class="price">100</span>
        </div>
        <div class="item">
            <span class="name">商品B</span>
            <span class="price">200</span>
        </div>
    </div>
</body>
</html>
"""

tree = etree.HTML(html)
items = tree.xpath('//div[@class="item"]')

for item in items:
    name = item.xpath('.//span[@class="name"]/text()')[0]
    price = item.xpath('.//span[@class="price"]/text()')[0]
    print(f"{name}: {price}")
