function Tools () {
    return [
        {
            'name':'olevba',
            'attribution':{
                'author':'Philippe Lagadec',
                'website':'http://decalage.info/python/oletools'
            },
            'file_types':['OLE', 'OpenXML'],
            'tool_options':[
                {'flag':'h','valued':false},
                {'flag':'r','valued':false},
                {'flag':'z','valued':'string'},
                {'flag':'p','valued':'string'},
                {'flag':'f','valued':'string'},
                {'flag':'a','valued':false},
                {'flag':'c','valued':false},
                {'flag':'decode','valued':false},
                {'flag':'attr','valued':false},
                {'flag':'reveal','valued':false},
                {'flag':'l','valued':'list','values':['debug','info','warning','error','critical']},
                {'flag':'deobf','valued':false},
                {'flag':'relaxed','valued':false},
                {'flag':'show-pcode','valued':false},
                {'flag':'no-pcode','valued':false},
                {'flag':'no-xlm','valued':false},
                {'flag':'t','valued':false},
                {'flag':'d','valued':false},
                {'flag':'j','valued':false}
            ]
        }
    ];
}

export default Tools;