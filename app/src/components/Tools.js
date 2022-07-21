
        /* BOILERPLATE
        {
            'name':'',
            'attribution':{
                'author':'',
                'website':''
            },
            'uri_first':'',
            'long_flag_equals':'',
            'file_types':[''],
            'help_flag':'',
            'tool_options':[
                {'flag':'','type':'','selected':'','value':''}
            ],
            'locked_tool_options':[
                {'flag':'','type':'','value':''}
            ]
        }*/

function Tools () {
    let tools = [
        {
            'name':'olevba',
            'attribution':{
                'author':'Philippe Lagadec',
                'website':'http://decalage.info/python/oletools'
            },
            'uri_first':false,
            'long_flag_equals':false,
            'file_types':['OLE', 'OpenXML'],
            'help_flag':'help',
            'tool_options':[
                {'flag':'help','type':'boolean','selected':false, 'value':true},
                {'flag':'zip','type':'string','selected':false, 'value':null},
                {'flag':'password','type':'string','selected':false, 'value':null},
                {'flag':'zipfname','type':'string','selected':false, 'value':null},
                {'flag':'analysis','type':'boolean','selected':false, 'value':true},
                {'flag':'code','type':'boolean','selected':false, 'value':true},
                {'flag':'decode','type':'boolean','selected':false, 'value':true},
                {'flag':'attr','type':'boolean','selected':false, 'value':true},
                {'flag':'reveal','type':'boolean','selected':false, 'value':true},
                {'flag':'loglevel','type':'string','selected':false, 'value':null},
                {'flag':'deobf','type':'boolean','selected':false, 'value':true},
                {'flag':'relaxed','type':'boolean','selected':false, 'value':true},
                {'flag':'show-pcode','type':'boolean','selected':false, 'value':true},
                {'flag':'no-pcode','type':'boolean','selected':false, 'value':true},
                {'flag':'no-xlm','type':'boolean','selected':false, 'value':true},
                {'flag':'triage','type':'boolean','selected':false, 'value':true},
                {'flag':'detailed','type':'boolean','selected':false, 'value':true},
                {'flag':'json','type':'boolean','selected':false, 'value':true}
            ],
            'locked_tool_options':null
        },
        {
            'name':'pdfid.py',
            'attribution':{
                'author':'Didier Stevens',
                'website':'https://DidierStevens.com'
            },
            'uri_first':false,
            'long_flag_equals':true,
            'file_types':['PDF'],
            'help_flag':'help',
            'tool_options':[
                {'flag':'help','type':'boolean','selected':false,'value':true},
                {'flag':'version','type':'boolean','selected':false,'value':true},
                {'flag':'force','type':'boolean','selected':false,'value':true},
                {'flag':'verbose','type':'boolean','selected':false,'value':true},
                {'flag':'select','type':'string','selected':false,'value':null},
                {'flag':'nozero','type':'boolean','selected':false,'value':true},
                {'flag':'all','type':'boolean','selected':false,'value':true},
                {'flag':'extra','type':'boolean','selected':false,'value':true},
                {'flag':'plugins','type':'string','selected':false,'value':null},
                {'flag':'pluginoptions','type':'string','selected':false,'value':null},
                {'flag':'csv','type':'boolean','selected':false,'value':true},
                {'flag':'minimumscore','type':'string','selected':false,'value':null},
                {'flag':'output','type':'static','selected':false,'value':'__FILEOUT::output_pdfid.txt'}
            ],
            'locked_tool_options':null
        },
        {
            'name':'pdf-parser.py',
            'attribution':{
                'author':'Didier Stevens',
                'website':'https://DidierStevens.com'
            },
            'uri_first':false,
            'long_flag_equals':true,
            'file_types':['PDF'],
            'help_flag':'help',
            'tool_options':[
                {'flag':'version','type':'boolean','selected':false,'value':true},
                {'flag':'help','type':'boolean','selected':false,'value':true},
                {'flag':'search','type':'string','selected':false,'value':null},
                {'flag':'filter','type':'boolean','selected':false,'value':true},
                {'flag':'object','type':'string','selected':false,'value':null},
                {'flag':'reference','type':'string','selected':false,'value':null},
                {'flag':'elements','type':'string','selected':false,'value':null},
                {'flag':'raw','type':'boolean','selected':false,'value':true},
                {'flag':'stats','type':'boolean','selected':false,'value':true},
                {'flag':'type','type':'string','selected':false,'value':null},
                {'flag':'objstm','type':'boolean','selected':false,'value':true},
                {'flag':'verbose','type':'boolean','selected':false,'value':true},
                {'flag':'hash','type':'boolean','selected':false,'value':true},
                {'flag':'nocanonicalizedoutput','type':'boolean','selected':false,'value':true},
                {'flag':'dump','type':'static','selected':false,'value':'__FILEOUT::output_pdf-parser.txt'},
                {'flag':'debug','type':'boolean','selected':false,'value':true},
                {'flag':'content','type':'boolean','selected':false,'value':true},
                {'flag':'searchstream','type':'string','selected':false,'value':null},
                {'flag':'unfiltered','type':'boolean','selected':false,'value':true},
                {'flag':'casesensitive','type':'boolean','selected':false,'value':true},
                {'flag':'regex','type':'boolean','selected':false,'value':true},
                {'flag':'overridingfilters','type':'string','selected':false,'value':null},
                {'flag':'yarastrings','type':'boolean','selected':false,'value':true},
                {'flag':'key','type':'string','selected':false,'value':null}
            ],
            'locked_tool_options':null
        },
        {
            'name':'7z',
            'attribution':{
                'author':'Igor Pavlov',
                'website':'https://www.7-zip.org'
            },
            'uri_first':false,
            'long_flag_equals':true,
            'file_types':['Archives'],
            'help_flag':'h',
            'tool_options':[
                {'flag':'h','type':'boolean','selected':false,'value':true},
                {'flag':'e','type':'boolean_noswitch','selected':false,'value':true},
                {'flag':'l','type':'boolean_noswitch','selected':false,'value':true},
                {'flag':'p','type':'string_nospace','selected':false,'value':null}
            ],
            'locked_tool_options':[
                {'flag':'y','type':'boolean','value':true},
                {'flag':'o','type':'string_nospace','value':'__FILEOUT'}
            ]
        },
        {
            'name':'zipdump.py',
            'attribution':{
                'author':'Didier Stevens',
                'website':'https://blog.didierstevens.com/2020/07/27/update-zipdump-py-version-0-0-20/'
            },
            'uri_first':false,
            'long_flag_equals':true,
            'file_types':['ZIP'],
            'help_flag':'help',
            'tool_options':[
                {'flag':'help','type':'boolean','selected':false,'value':true},
                {'flag':'version','type':'boolean','selected':false,'value':true},
                {'flag':'select','type':'string','selected':false,'value':null},
                {'flag':'output','type':'static','selected':false,'value':'__FILEOUT::output_zipdump.txt'},
                {'flag':'dump','type':'boolean','selected':false,'value':true},
                {'flag':'dumpall','type':'boolean','selected':false,'value':true},
                {'flag':'hexdump','type':'boolean','selected':false,'value':true},
                {'flag':'hexdumpall','type':'boolean','selected':false,'value':true},
                {'flag':'asciidump','type':'boolean','selected':false,'value':true},
                {'flag':'asciidumpall','type':'boolean','selected':false,'value':true},
                {'flag':'translate','type':'string','selected':false,'value':null},
                {'flag':'extended','type':'boolean','selected':false,'value':true},
                {'flag':'password','type':'string','selected':false,'value':null},
                {'flag':'verbose','type':'boolean','selected':false,'value':true},
                {'flag':'regular','type':'boolean','selected':false,'value':true},
                {'flag':'zipfilename','type':'boolean','selected':false,'value':true},
                {'flag':'jsonoutput','type':'boolean','selected':false,'value':true},
                {'flag':'find','type':'string','selected':false,'value':null},
                {'flag':'info','type':'boolean','selected':false,'value':true}
            ],
            'locked_tool_options':null
        },
        {
            'name':'exiftool',
            'attribution':{
                'author':'Phil Harvey',
                'website':'https://exiftool.org'
            },
            'uri_first':false,
            'long_flag_equals':false,
            'file_types':['Images'],
            'help_flag':'none',
            'tool_options':[
                {'flag':'binary','type':'boolean_oneswitch','selected':false,'value':true},
                {'flag':'dateFormat','type':'string_oneswitch','selected':false,'value':true},
                {'flag':'decimal','type':'boolean_oneswitch','selected':false,'value':true},
                {'flag':'htmlFormat','type':'boolean_oneswitch','selected':false,'value':true},
                {'flag':'hex','type':'boolean_oneswitch','selected':false,'value':true},
                {'flag':'json','type':'boolean_oneswitch','selected':false,'value':true},
                {'flag':'long','type':'boolean_oneswitch','selected':false,'value':true},
                {'flag':'short','type':'boolean_oneswitch','selected':false,'value':true},
                {'flag':'veryShort','type':'boolean_oneswitch','selected':false,'value':true},
                {'flag':'tab','type':'boolean_oneswitch','selected':false,'value':true},
                {'flag':'table','type':'boolean_oneswitch','selected':false,'value':true},
                {'flag':'verbose','type':'string_oneswitch','selected':false,'value':'1'},
                {'flag':'xmlFormat','type':'boolean_oneswitch','selected':false,'value':true}
            ],
            'locked_tool_options':null
        },
        {
            'name':'manalyze',
            'attribution':{
                'author':'Ivan Kwiatkowski',
                'website':'https://github.com/JusticeRage/Manalyze'
            },
            'uri_first':false,
            'long_flag_equals':true,
            'file_types':['PE'],
            'help_flag':'help',
            'tool_options':[
                {'flag':'help','type':'boolean','selected':false,'value':true},
                {'flag':'version','type':'boolean','selected':false,'value':true},
                {'flag':'output','type':'string','selected':false,'value':null},
                {'flag':'dump','type':'string','selected':false,'value':null},
                {'flag':'hashes','type':'boolean','selected':false,'value':true},
                {'flag':'extract','type':'static','selected':false,'value':'__FILEOUT'},
                {'flag':'plugins','type':'string','selected':false,'value':null}
            ],
            'locked_tool_options':null
        },
        {
            'name':'peframe',
            'attribution':{
                'author':'Gianni Amato',
                'website':'https://github.com/guelfoweb/peframe'
            },
            'uri_first':false,
            'long_flag_equals':false,
            'file_types':['PE'],
            'help_flag':'help',
            'tool_options':[
                {'flag':'help','type':'boolean','selected':false,'value':true},
                {'flag':'version','type':'boolean','selected':false,'value':true},
                {'flag':'xorsearch','type':'string','selected':false,'value':null},
                {'flag':'json','type':'boolean','selected':false,'value':true},
                {'flag':'strings','type':'boolean','selected':false,'value':true}
            ],
            'locked_tool_options':null
        },
        {
            'name':'flarestrings',
            'attribution':{
                'author':'FireEye Inc.',
                'website':'https://github.com/fireeye/stringsifter'
            },
            'uri_first':false,
            'long_flag_equals':false,
            'file_types':['PE'],
            'help_flag':'help',
            'tool_options':[
                {'flag':'help','type':'boolean','selected':false,'value':true},
                {'flag':'version','type':'boolean','selected':false,'value':true},
                {'flag':'min-len','type':'string','selected':false,'value':null}
            ],
            'locked_tool_options':null
        },
        {
            'name':'box-js',
            'attribution':{
                'author':'CapacitorSet',
                'website':'https://github.com/CapacitorSet/box-js'
            },
            'uri_first':false,
            'long_flag_equals':true,
            'file_types':['JavaScript'],
            'help_flag':'help',
            'tool_options':[
                {'flag':'help','type':'boolean','selected':false,'value':true},
                {'flag':'version','type':'boolean','selected':false,'value':true},
                {'flag':'license','type':'boolean','selected':false,'value':true},
                {'flag':'debug','type':'boolean','selected':false,'value':true},
                {'flag':'loglevel','type':'string','selected':false,'value':null},
                {'flag':'download','type':'boolean','selected':false,'value':true},
                {'flag':'encoding','type':'string','selected':false,'value':null},
                {'flag':'timeout','type':'string','selected':false,'value':null},
                {'flag':'preprocess','type':'boolean','selected':false,'value':true},
                {'flag':'unsafe-preprocess','type':'boolean','selected':false,'value':true},
                {'flag':'no-echo','type':'boolean','selected':false,'value':true},
                {'flag':'no-rewrite','type':'boolean','selected':false,'value':true},
                {'flag':'no-catch-rewrite','type':'boolean','selected':false,'value':true},
                {'flag':'no-cc_on-rewrite','type':'boolean','selected':false,'value':true},
                {'flag':'no-eval-rewrite','type':'boolean','selected':false,'value':true},
                {'flag':'no-file-exists','type':'boolean','selected':false,'value':true},
                {'flag':'no-folder-exists','type':'boolean','selected':false,'value':true},
                {'flag':'function-rewrite','type':'boolean','selected':false,'value':true},
                {'flag':'no-rewrite-prototype','type':'boolean','selected':false,'value':true},
                {'flag':'no-hoist-prototype','type':'boolean','selected':false,'value':true},
                {'flag':'no-shell-error','type':'boolean','selected':false,'value':true},
                {'flag':'no-typeof-rewrite','type':'boolean','selected':false,'value':true},
                {'flag':'windows-xp','type':'boolean','selected':false,'value':true}
            ],
            'locked_tool_options':[
                {'flag':'output-dir','type':'string','selected':false,'value':'__FILEOUT'}
            ]
        },
        {
            'name':'base64',
            'attribution':{
                'author':'Simon Josefsson',
                'website':'https://www.gnu.org/software/coreutils/base64'
            },
            'uri_first':false,
            'long_flag_equals':true,
            'file_types':['Text'],
            'help_flag':'help',
            'tool_options':[
                {'flag':'help','type':'boolean','selected':false,'value':true},
                {'flag':'version','type':'boolean','selected':false,'value':true},
                {'flag':'decode','type':'boolean','selected':false,'value':true},
                {'flag':'ignore-garbage','type':'boolean','selected':false,'value':true},
                {'flag':'wrap','type':'string','selected':false,'value':null}
            ],
            'locked_tool_options':null
        }
    ];


    return tools.sort((a, b) => {
        return a.name.localeCompare(b.name)
    });
}

export default Tools;