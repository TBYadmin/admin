/* eslint-disable */
require('script-loader!file-saver');
require('script-loader!@/vendor/Blob');

require('script-loader!xlsx/dist/xlsx.core.min');
require('script-loader!xlsx-style/dist/xlsx.full.min');
require('script-loader!file-saver');


function generateArray(table) {
  var out = [];
  var rows = table.querySelectorAll('tr');
  var ranges = [];
  for (var R = 0; R < rows.length; ++R) {
    var outRow = [];
    var row = rows[R];
    var columns = row.querySelectorAll('td');
    for (var C = 0; C < columns.length; ++C) {
      var cell = columns[C];
      var colspan = cell.getAttribute('colspan');
      var rowspan = cell.getAttribute('rowspan');
      var cellValue = cell.innerText;
      if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

      //Skip ranges
      ranges.forEach(function (range) {
        if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
          for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
        }
      });

      //Handle Row Span
      if (rowspan || colspan) {
        rowspan = rowspan || 1;
        colspan = colspan || 1;
        ranges.push({s: {r: R, c: outRow.length}, e: {r: R + rowspan - 1, c: outRow.length + colspan - 1}});
      }
      ;

      //Handle Value
      outRow.push(cellValue !== "" ? cellValue : null);

      //Handle Colspan
      if (colspan) for (var k = 0; k < colspan - 1; ++k) outRow.push(null);
    }
    out.push(outRow);
  }
  return [out, ranges];
};

function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
  var ws = {};
  var range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      var cell = {v: data[R][C]};
      if (cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({c: C, r: R});

      if (typeof cell.v === 'number') cell.t = 'n';
      else if (typeof cell.v === 'boolean') cell.t = 'b';
      else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      }
      else cell.t = 's';

      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

export function export_table_to_excel(id) {
  var theTable = document.getElementById(id);
  console.log('a')
  var oo = generateArray(theTable);
  var ranges = oo[1];

  /* original data */
  var data = oo[0];
  var ws_name = "SheetJS";
  console.log(data);

  var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

  /* add ranges to worksheet */
  // ws['!cols'] = ['apple', 'banan'];
  ws['!merges'] = ranges;

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});

  saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), "test.xlsx")
}

function formatJson(jsonData) {
  console.log(jsonData)
}
export function export_json_to_excel_financial(th, jsonData, defaultTitle) {
  /* original data */
  var data = jsonData;
  data.unshift(th);
  data.unshift(['营业点','收入总额','应付合作方','','','开票金额','未票金额','收款方式','','','','','','','到账情况','','','','','未到账金额','其他']);
  data.unshift(['财务结算汇总表']);
  var ws_name = "财务结算汇总表";
  var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
    ws["!merges"] = [
        {  //合并A1U1单元格
            s: {//s为开始
                c: 0,//开始列
                r: 0//开始取值范围
            },
            e: {//e结束
                c: 20,//结束列
                r: 0//结束范围
            }
        },
         {  //合并A2A3单元格
            s: {//s为开始
                c: 0,//开始列
                r: 1//开始取值范围
            },
            e: {//e结束
                c: 0,//结束列
                r: 2//结束范围
            }
        },
        {  //合并B2B3单元格
            s: {//s为开始
                c: 1,//开始列
                r: 1//开始取值范围
            },
            e: {//e结束
                c: 1,//结束列
                r: 2//结束范围
            }
        },
        {  //合并F2F3单元格
            s: {//s为开始
                c: 5,//开始列
                r: 1//开始取值范围
            },
            e: {//e结束
                c: 5,//结束列
                r: 2//结束范围
            }
        },
        {  //合并G2G3单元格
            s: {//s为开始
                c: 6,//开始列
                r: 1//开始取值范围
            },
            e: {//e结束
                c: 6,//结束列
                r: 2//结束范围
            }
        },
        {  //合并T2T3单元格
            s: {//s为开始
                c: 19,//开始列
                r: 1//开始取值范围
            },
            e: {//e结束
                c: 19,//结束列
                r: 2//结束范围
            }
        },
        {  //合并U2U3单元格
            s: {//s为开始
                c: 20,//开始列
                r: 1//开始取值范围
            },
            e: {//e结束
                c: 20,//结束列
                r: 2//结束范围
            }
        },
        {  //合并C2E2单元格
            s: {//s为开始
                c: 2,//开始列
                r: 1//开始取值范围
            },
            e: {//e结束
                c: 4,//结束列
                r: 1//结束范围
            }
        },
        {  //合并H2N2单元格
            s: {//s为开始
                c: 7,//开始列
                r: 1//开始取值范围
            },
            e: {//e结束
                c: 13,//结束列
                r: 1//结束范围
            }
        },
        {  //合并O2S2单元格
            s: {//s为开始
                c: 14,//开始列
                r: 1//开始取值范围
            },
            e: {//e结束
                c: 18,//结束列
                r: 1//结束范围
            }
        },
    ]
    console.log(ws)
    ws["A1"].s = {  //设置主标题样式
        alignment: {
            horizontal: "center" ,
            vertical: "center"
        }
    };
    ws["A2"].s = {  //设置主标题样式
        alignment: {
            horizontal: "center" ,
            vertical: "center"
        }
    };
    ws["B2"].s = {  //设置主标题样式
        alignment: {
            horizontal: "center" ,
            vertical: "center"
        }
    };
    ws["C2"].s = {  //设置主标题样式
        alignment: {
            horizontal: "center" ,
            vertical: "center"
        }
    };
    ws["F2"].s = {  //设置主标题样式
        alignment: {
            horizontal: "center" ,
            vertical: "center"
        }
    };
    ws["G2"].s = {  //设置主标题样式
        alignment: {
            horizontal: "center" ,
            vertical: "center"
        }
    };
    ws["H2"].s = {  //设置主标题样式
        alignment: {
            horizontal: "center" ,
            vertical: "center"
        }
    };
    ws["O2"].s = {  //设置主标题样式
        alignment: {
            horizontal: "center" ,
            vertical: "center"
        }
    };
    ws["T2"].s = {  //设置主标题样式
        alignment: {
            horizontal: "center" ,
            vertical: "center"
        }
    };
    ws["U2"].s = {  //设置主标题样式
        alignment: {
            horizontal: "center" ,
            vertical: "center"
        }
    };

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});
  var title = defaultTitle || '列表'
  saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), title + ".xlsx")
}

export function export_json_to_excel_site(th, jsonData, defaultTitle) {

    /* original data */

    var data = jsonData;
    data.unshift(th);
    //data.unshift(['营业点','收入总额','应付合作方','','','开票金额','未票金额','收款方式','','','','','','','到账情况','','','','','未到账金额','其他']);
    data.unshift(['营业点收入人数统计表']);
    var ws_name = "营业点收入人数统计表";
    var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
    ws["!merges"] = [
        {  //合并A1G1单元格
            s: {//s为开始
                c: 0,//开始列
                r: 0//开始取值范围
            },
            e: {//e结束
                c: 8,//结束列
                r: 0//结束范围
            }
        },
        ]
    console.log(ws)
    ws["A1"].s = {  //设置主标题样式
        alignment: {
            horizontal: "center" ,
            vertical: "center"
        }
    };
    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});
    var title = defaultTitle || '列表'
    saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), title + ".xlsx")
}

export function export_json_to_excel_commodity(th, jsonData, defaultTitle) {

    /* original data */

    var data = jsonData;
    data.unshift(th);
    //data.unshift(['营业点','收入总额','应付合作方','','','开票金额','未票金额','收款方式','','','','','','','到账情况','','','','','未到账金额','其他']);
    data.unshift(['商品销售表']);
    var ws_name = "商品销售表";
    var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
    ws["!merges"] = [
        {  //合并A1G1单元格
            s: {//s为开始
                c: 0,//开始列
                r: 0//开始取值范围
            },
            e: {//e结束
                c: 8,//结束列
                r: 0//结束范围
            }
        },
    ]
    console.log(ws)
    ws["A1"].s = {  //设置主标题样式
        alignment: {
            horizontal: "center" ,
            vertical: "center"
        }
    };
    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});
    var title = defaultTitle || '列表'
    saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), title + ".xlsx")
}
export function export_json_to_excel_shouldCollect(th, jsonData, defaultTitle) {
    /* original data */
    var data = jsonData;
    data.unshift(th);
    data.unshift(['应收明细','应收金额','类型','','','发生时间','其他']);
    data.unshift(['应收账款明细表']);
    var ws_name = "应收账款明细表";
    var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
    ws["!merges"] = [
        {  //合并A1G1单元格
            s: {//s为开始
                c: 0,//开始列
                r: 0//开始取值范围
            },
            e: {//e结束
                c: 6,//结束列
                r: 0//结束范围
            }
        },
        {  //合并A2A3单元格
            s: {//s为开始
                c: 0,//开始列
                r: 1//开始取值范围
            },
            e: {//e结束
                c: 0,//结束列
                r: 2//结束范围
            }
        },
        {  //合并B2B3单元格
            s: {//s为开始
                c: 1,//开始列
                r: 1//开始取值范围
            },
            e: {//e结束
                c: 1,//结束列
                r: 2//结束范围
            }
        },
        {  //合并C2E2单元格
            s: {//s为开始
                c: 2,//开始列
                r: 1//开始取值范围
            },
            e: {//e结束
                c: 4,//结束列
                r: 1//结束范围
            }
        },
        {  //合并F2F3单元格
            s: {//s为开始
                c: 5,//开始列
                r: 1//开始取值范围
            },
            e: {//e结束
                c: 5,//结束列
                r: 2//结束范围
            }
        },
        {  //合并F2F3单元格
            s: {//s为开始
                c: 6,//开始列
                r: 1//开始取值范围
            },
            e: {//e结束
                c: 6,//结束列
                r: 2//结束范围
            }
        },


    ]
    console.log(ws)
    ws["A1"].s = {  //设置主标题样式
        alignment: {
            horizontal: "center" ,
            vertical: "center"
        }
    };
    ws["A2"].s = {  //设置主标题样式
        alignment: {
            horizontal: "center" ,
            vertical: "center"
        }
    };
    ws["B2"].s = {  //设置主标题样式
        alignment: {
            horizontal: "center" ,
            vertical: "center"
        }
    };
    ws["C2"].s = {  //设置主标题样式
        alignment: {
            horizontal: "center" ,
            vertical: "center"
        }
    };
    ws["G2"].s = {  //设置主标题样式
        alignment: {
            horizontal: "center" ,
            vertical: "center"
        }
    };
    ws["F2"].s = {  //设置主标题样式
        alignment: {
            horizontal: "center" ,
            vertical: "center"
        }
    };

    // ws["H2"].s = {  //设置主标题样式
    //     alignment: {
    //         horizontal: "center" ,
    //         vertical: "center"
    //     }
    // };
    // ws["O2"].s = {  //设置主标题样式
    //     alignment: {
    //         horizontal: "center" ,
    //         vertical: "center"
    //     }
    // };
    // ws["T2"].s = {  //设置主标题样式
    //     alignment: {
    //         horizontal: "center" ,
    //         vertical: "center"
    //     }
    // };
    // ws["U2"].s = {  //设置主标题样式
    //     alignment: {
    //         horizontal: "center" ,
    //         vertical: "center"
    //     }
    // };

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});
    var title = defaultTitle || '列表';
    saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), title + ".xlsx")
}
