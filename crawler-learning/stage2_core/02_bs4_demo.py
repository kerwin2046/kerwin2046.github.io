from bs4 import BeautifulSoup
import xlsxwriter as xlsx


html = """
<div class="listing-section">
            <ul class="exhibitor-excerpt">
            
            <li> 
                <a href="https://www.automateshow.com/exhibitors/hyster-yale"><span class="exhibitor-name">Yale Lift Truck Technologies</span></a>
                <span class="exhibitor-booth">
					
							Booth #1272 
				</span>
                
                <div class="keys">
                    
                </div>
            </li>
            
            <li> 
                <a href="https://www.automateshow.com/exhibitors/yaskawa-motoman"><span class="exhibitor-name">Yaskawa America Inc., Drives and Motion Division</span></a>
                <span class="exhibitor-booth">
					
							Booth #202 
				</span>
                
                <div class="keys">
                    
                </div>
            </li>
            
            <li> 
                <a href="https://www.automateshow.com/exhibitors/yaskawa-motoman"><span class="exhibitor-name">Yaskawa America Inc., Motoman Robotics Division</span></a>
                <span class="exhibitor-booth">
					
							Booth #34051 
				</span>
                
                <div class="keys">
                    
                </div>
            </li>
            
            <li> 
                <a href="https://www.automateshow.com/exhibitors/yaskawa-america-inc-motoman-robotics-division"><span class="exhibitor-name">Yaskawa America, Inc., Motoman Robotics Division</span></a>
                <span class="exhibitor-booth">
					
							Booth #601 
				</span>
                
                <div class="keys">
                    
                </div>
            </li>
            
            <li> 
                <a href="https://www.automateshow.com/exhibitors/yfc-boneagle-electric-co-ltd"><span class="exhibitor-name">YFC-BonEagle Electric Co. Ltd.</span></a>
                <span class="exhibitor-booth">
					
							Booth #4367 
				</span>
                
                <div class="keys">
                    
                </div>
            </li>
            
            <li> 
                <a href="https://www.automateshow.com/exhibitors/yifan-motors"><span class="exhibitor-name">Yifan Motors</span></a>
                <span class="exhibitor-booth">
					
							Booth #3821 
				</span>
                
                <div class="keys">
                    
                </div>
            </li>
            
            <li> 
                <a href="https://www.automateshow.com/exhibitors/yixin-precision-metal-and-plastic-ltd"><span class="exhibitor-name">Yixin Precision Metal and Plastic Ltd.</span></a>
                <span class="exhibitor-booth">
					
							Booth #4273 
				</span>
                
                <div class="keys">
                    
                </div>
            </li>
            
            <li> 
                <a href="https://www.automateshow.com/exhibitors/yrg-inc"><span class="exhibitor-name">YRG, Inc.</span></a>
                <span class="exhibitor-booth">
					
							Booth #2214 
				</span>
                
                <div class="keys">
                    
                </div>
            </li>
            
            <li> 
                <a href="https://www.automateshow.com/exhibitors/yuan-high-tech-development-co-ltd"><span class="exhibitor-name">Yuan High-Tech Development Co. Ltd.</span></a>
                <span class="exhibitor-booth">
					
							Booth #12035 
				</span>
                
                <div class="keys">
                    
                </div>
            </li>
            
            <li> 
                <a href="https://www.automateshow.com/exhibitors/yushin-america-inc "><span class="exhibitor-name">Yushin America, Inc. </span></a>
                <span class="exhibitor-booth">
					
							Booth #4221 
				</span>
                
                <div class="keys">
                    
                </div>
            </li>
            
            </ul>
        </div>
"""

soup = BeautifulSoup(html, "lxml")

li_tags = soup.select("li")

with xlsx.Workbook("exhibitors.xlsx") as workbook:
    worksheet = workbook.add_worksheet()
    worksheet.write(0, 0, "链接")
    worksheet.write(0, 1, "名称")
    worksheet.write(0, 2, "展位号")

    for i, li in enumerate(li_tags, start=1):
        link = li.select_one("a")["href"]
        name = li.select_one(".exhibitor-name").text
        booth = li.select_one(".exhibitor-booth").text
        worksheet.write(i, 0, link)
        worksheet.write(i, 1, name)
        worksheet.write(i, 2, booth)

print("Excel 文件输出完成")
