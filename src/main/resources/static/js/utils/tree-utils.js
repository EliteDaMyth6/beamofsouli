/**
 * 加载树控件根节点需要提供的数据
 */
var loadTreeRootUrl = 'permission/single';
var loadTreeRootDataFunction = () => ({id: 1})
var loadTreeRootCallback = (content, data) => {
	data.obj.countOfChildren = 1;
	content.push(parseNode(data.obj));
};

/**
 * 加载树控件根节点下子节点需要提供的数据
 */
var loadTreeNodeUrl = 'permission/children';
var loadTreeNodeDataFunction = (parent) => ({condition: {parentId: parent.id}})
var loadTreeNodeCallback = (content, data) => {
	let children = data.children;
	for(let r in children) content.push(parseNode(children[r]));
}
/**
 * 将输入数据解析成树控件node节点
 */
var parseNode = (data) => ({id: data.id, expand: data.expand, title: data.name, children: data.countOfChildren != 0 ? [{}] : null});

/**
 * 生成并返回生成的树控件根节点 
 */
generateRootNode = () => {
	var content = [];
	$.posty(loadTreeRootUrl,loadTreeRootDataFunction(), (data) => loadTreeRootCallback(content, data));
	return content;
}

/**
 * 根据输入的父节点加载其下子节点
 * @param parent 父节点
 */
toggleExpand = (parent) => {
	if(!parent.expand) {
		//收缩时不需要重新加载数据
		return;
	} else {
		let content = [];
		$.posty(loadTreeNodeUrl,loadTreeNodeDataFunction(parent),(data) => loadTreeNodeCallback(content,data));
		parent.children = content;
	}
}

/**
 * 当树控件任何节点被点选中时发生的事件
 * @param node 被点选的节点
 */
selectChange = (node) => alert(`selectChange: ${JSON.stringify(node)}`);

/**
 * 当树控件任何节点前复选框被选中时发生的事件
 * @param nodes 一个到多个被点选中复选框的节点集合
 */
checkChange = (nodes) => alert(`checkChange: ${JSON.stringify(nodes)}`);

/**
 * 获取被鼠标选中的节点(非复选框被勾选)
 * @param nodes 被选中的节点集合
 */
getSelectedNodes = (nodes) => alert(`selectedNodes: ${JSON.stringify(nodes)}`);

/**
 * 获取复选框被选中的节点集合
 * @param nodes 被选中复选框的节点集合
 */
getCheckedNodes = (nodes) => alert(`checkedNodes: ${JSON.stringify(nodes)}`);

/**
 * 根据输入的节点id在某一个节点下获取节点对象，并在原有父节点下删除其数据对象
 * @param id 要查找的节点id
 * @param node 包含该子节点的节点对象
 * @returns 找到的节点对象
 */
getChildFromNode = (id, node) => {
	let target = null;
	let inCurrentNode = false;
	const children = node.children;
	for (let r in children) {
		let child = children[r];
		if (child.id == id) {
			target = child;
			inCurrentNode = true;
		} else {
			target = getChildFromNode(id, child);
		}
		if (target != null) {
			if (inCurrentNode) {
				node.children.splice(r,1);
				if (node.children.length == 0) node.children = null;
			}
			return target;
		}
	}
}

/**
 * 根据输入的父节点id在输入的节点对象中查找该父节点对象的位置，并将输入的子节点插入到该父节点对象下
 * @param child 将被插入的子节点对象
 * @param parentId 父节点id
 * @param node 包含该父节点的节点对象
 */
setChildToNode = (child, parentId, node) => {
	if (node.id != parentId) {
		let children = node.children;
		if (children) {
			for(let r in children) {
				setChildToNode(child, parentId, children[r]);
			}
		}
	} else {
		if (node.children) {
			node.children.push(child);
		} else {
			node.children = [child];
		}
	}
}
