import cloudscraper
from bs4 import BeautifulSoup
import xlsxwriter as xlsx


def scrape_exhibitors():
    url = "https://www.automateshow.com/exhibitors"

    print("正在获取网页 (使用 cloudscraper)...")
    scraper = cloudscraper.create_scraper()
    resp = scraper.get(url)
    resp.encoding = "utf-8"
    print(f"状态码: {resp.status_code}")

    soup = BeautifulSoup(resp.text, "lxml")
    li_tags = soup.select("ul.exhibitor-excerpt li")
    print(f"找到 {len(li_tags)} 个展商")

    with xlsx.Workbook("exhibitors_full.xlsx") as workbook:
        worksheet = workbook.add_worksheet()
        worksheet.write(0, 0, "链接")
        worksheet.write(0, 1, "名称")
        worksheet.write(0, 2, "展位号")

        for i, li in enumerate(li_tags, start=1):
            a_tag = li.select_one("a")
            name_tag = li.select_one(".exhibitor-name")
            booth_tag = li.select_one(".exhibitor-booth")

            link = a_tag["href"] if a_tag else ""
            name = name_tag.text.strip() if name_tag else ""
            booth = booth_tag.text.strip() if booth_tag else ""

            worksheet.write(i, 0, link)
            worksheet.write(i, 1, name)
            worksheet.write(i, 2, booth)

            if i % 100 == 0:
                print(f"已处理 {i} 个展商...")

    print(f"完成! 共抓取 {len(li_tags)} 个展商，保存到 exhibitors_full.xlsx")


if __name__ == "__main__":
    scrape_exhibitors()
