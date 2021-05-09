// 加载table数据	
function loadPageFn () {
	var _self = this;
	const msg = _self.$Message.loading('正在加载中...',0);
	clearTableCheckedData();
	$.iposty(loadPageableDataUrl, {page: (_self.pageCurrent-1) , size: _self.pageSize,condition:formatQueryFormData(_self)}, 
			function(data){
				_self.tableData = formatTableData(data);// 分页数据
				_self.pageTotal = data.pageableData.totalElements;// 总记录数
				setTimeout(msg, 100);//销毁加载提示
			},
			function(errorMessage){
				_self.$Message.error(errorMessage);	
				setTimeout(msg, 100);//销毁加载提示
			}
	);
}

// 翻页
function changePageFn (pageClick) {
	if (this.pageCurrent != pageClick) {
		this.pageCurrent = pageClick;
	}
	this.loadPage();
}

// 取出table选中checkbox的所有记录id
function getTableCheckedDataIds(tableCheckedData) {
	var ids = '';
	for (var i in tableCheckedData){
		ids+=tableCheckedData[i].id+",";
	}
	return (ids == '' ? ids : ids.substring(0, ids.length - 1));
}

// 清空当页选中的table中checkbox
function clearTableCheckedData(){
	vueContentObject.tableCheckedData = [];
}

// 格式化服务端返回的table数据
function formatTableData(data){
	var value = [];
	for(var i=0;i<data.pageableData.numberOfElements;i++) {
//		value[i] = parseValuesOnEachRow(data.pageableData.content[i]);
		value[i] = parseValuesOnTableEachRow(data.pageableData.content[i]);
		
	}
	return value;
}

// 对table中的数据进行更新
function fresh4NewData(data,callback) {
	// 暂时先请求后台 来重新加载数据
	vueContentObject.loadPage();
	callback();
}

// 创建 iview table 行 button
function createTableRowButtons(buttonsOnEachRow,row, column, index){
	var btnStr = '';
	for (var btnIndex in buttonsOnEachRow){
		var btn = buttonsOnEachRow[btnIndex];
		var btnAttributes = btn.split('#');
		btn = btnAttributes[0];
		var btnName = btnAttributes[1] ? btnAttributes[1] : btnAttributes[0];
		btnStr +='<i-button type="text" size="small" @click="'+btn+'('+index+')">'+btnName+'</i-button>';
	}
	return btnStr;
}

//创建 iview table 
function createTable(columnNames,attributeNames,buttonsOnEachRow){
	if(columnNames.length != attributeNames.length) return;
	var tableColumnData = [];
	for (var i=0;i<attributeNames.length;i++) { 
//		//测试 日期
//		if(i==7){tableColumnData[i]={title:columnNames[i],key:attributeNames[i],render (row) {return formatDate(row.createDate,true);}};continue;}
		if('operation'==attributeNames[i]){
			tableColumnData[i]={title:columnNames[i],key:attributeNames[i],
				render (row, column, index) {
					return createTableRowButtons(buttonsOnEachRow,row, column, index);
				}
			};
		}else if('selection'==attributeNames[i]){
			tableColumnData[i] = {type: 'selection',width: 60,align: 'center'};
		}else{
			tableColumnData[i]={title:columnNames[i],key:attributeNames[i]};
		}
	}
	return tableColumnData;
}
