function Tools () {
    return [
        {
            'name':'olevba',
            'attribution':{
                'author':'Philippe Lagadec',
                'website':'http://decalage.info/python/oletools'
            },
            'uri_first':false,
            'long_flag_equals':false,
            'file_types':['OLE', 'OpenXML'],
            'help_flag':'h',
            'tool_options':[
                {'flag':'h','type':'boolean','selected':false, 'value':true},
                {'flag':'r','type':'boolean','selected':false, 'value':true},
                {'flag':'z','type':'string','selected':false, 'value':null},
                {'flag':'p','type':'string','selected':false, 'value':null},
                {'flag':'f','type':'string','selected':false, 'value':null},
                {'flag':'a','type':'boolean','selected':false, 'value':true},
                {'flag':'c','type':'boolean','selected':false, 'value':true},
                {'flag':'decode','type':'boolean','selected':false, 'value':true},
                {'flag':'attr','type':'boolean','selected':false, 'value':true},
                {'flag':'reveal','type':'boolean','selected':false, 'value':true},
                {'flag':'l','type':'list','values':['debug','info','warning','error','critical'],'selected':false, 'value':null},
                {'flag':'deobf','type':'boolean','selected':false, 'value':true},
                {'flag':'relaxed','type':'boolean','selected':false, 'value':true},
                {'flag':'show-pcode','type':'boolean','selected':false, 'value':true},
                {'flag':'no-pcode','type':'boolean','selected':false, 'value':true},
                {'flag':'no-xlm','type':'boolean','selected':false, 'value':true},
                {'flag':'t','type':'boolean','selected':false, 'value':true},
                {'flag':'d','type':'boolean','selected':false, 'value':true},
                {'flag':'j','type':'boolean','selected':false, 'value':true}
            ]
        },
        {
            'name':'pdfid.py',
            'attribution':{
                'author':'Didier Stevens',
                'website':'https://DidierStevens.com'
            },
            'uri_first':false,
            'long_flag_equals':false,
            'file_types':['PDF'],
            'help_flag':'h',
            'tool_options':[
                {'flag':'version','type':'boolean','selected':false,'value':true},
                {'flag':'h','type':'boolean','selected':false,'value':true},
                {'flag':'f','type':'boolean','selected':false,'value':true},
                {'flag':'v','type':'boolean','selected':false,'value':true},
                {'flag':'S','type':'string','selected':false,'value':null},
                {'flag':'n','type':'boolean','selected':false,'value':true}
            ]
        },
        {
            'name':'pdf-parser.py',
            'attribution':{
                'author':'Didier Stevens',
                'website':'https://DidierStevens.com'
            },
            'uri_first':false,
            'long_flag_equals':false,
            'file_types':['PDF'],
            'help_flag':'h',
            'tool_options':[
                {'flag':'version','type':'boolean','selected':false,'value':true},
                {'flag':'h','type':'boolean','selected':false,'value':true},
                {'flag':'m','type':'boolean','selected':false,'value':true},
                {'flag':'s','type':'string','selected':false,'value':null},
                {'flag':'f','type':'boolean','selected':false,'value':true},
                {'flag':'o','type':'string','selected':false,'value':null},
                {'flag':'r','type':'string','selected':false,'value':null},
                {'flag':'e','type':'string','selected':false,'value':null},
                {'flag':'w','type':'boolean','selected':false,'value':true},
                {'flag':'a','type':'boolean','selected':false,'value':true},
                {'flag':'t','type':'string','selected':false,'value':null},
                {'flag':'O','type':'boolean','selected':false,'value':true},
                {'flag':'v','type':'boolean','selected':false,'value':true},
                {'flag':'H','type':'boolean','selected':false,'value':true},
                {'flag':'n','type':'boolean','selected':false,'value':true},
                {'flag':'D','type':'boolean','selected':false,'value':true},
                {'flag':'c','type':'boolean','selected':false,'value':true},
                {'flag':'searchstream','type':'string','selected':false,'value':null},
                {'flag':'unfiltered','type':'boolean','selected':false,'value':true},
                {'flag':'casesensitive','type':'boolean','selected':false,'value':true},
                {'flag':'regex','type':'boolean','selected':false,'value':true},
                {'flag':'overridingfilters','type':'string','selected':false,'value':null},
                {'flag':'yarastrings','type':'boolean','selected':false,'value':true},
                {'flag':'k','type':'string','selected':false,'value':null}
            ]
        }
    ];
}

export default Tools;