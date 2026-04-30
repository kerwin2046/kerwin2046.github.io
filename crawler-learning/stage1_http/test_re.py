import re

text = '''
<div class="product">
    <h3 class="title">Python书籍</h3>
    <span class="price">99.00</span>
    <a href="/product/123">查看详情</a>
</div>
'''

# 标题
title = re.search(r'<h3 class="title">(.*?)</h3>', text)
print(f"标题: {title.group(1)}")

# 价格（修复点）
price = re.search(r'<span class="price">([\d.]+)</span>', text)
print(f"价格: {price.group(1)}")

# 链接
href = re.search(r'href="([^"]+)"', text)
print(f"链接: {href.group(1)}")
