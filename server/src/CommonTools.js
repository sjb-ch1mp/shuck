const commonTools = [
    {
        'name':'file',
        'tool_options':[
            {'flag':'i','type':'boolean','selected':false, 'value':true}
        ]
    }
];

function getToolByName(name){
    for(let i in commonTools){
        if(commonTools[i].name === name){
            return commonTools[i];
        }
    }
    return null;
}

function updateToolOption(tool, flag, newValue){
    for(let i in tool.tool_options){
        if(tool.tool_options[i].flag === flag){
            tool.tool_options[i].value = newValue;
        }
    }
    return tool;
}

module.exports.getToolByName = getToolByName;
module.exports.updateToolOption = updateToolOption;