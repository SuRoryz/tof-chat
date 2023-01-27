import { SOCKET_TYPES } from './constants'

const Parser = require('parse5').Parser

export const unicodeToChar = (text) => text.replace(/\u[\dA-F]{4}/gi, (match) => String.fromCharCode(parseInt(match.replace(/\u/g, ''), 16)))

export const getChildNodesValue = (htmlParser) => {
    return Array.isArray(htmlParser.childNodes)
        ? htmlParser.childNodes.map(getChildNodesValue).join(' ')
        : htmlParser.value.trim()
}

export const filterDublicateMessagesByHashId = (messages) => Object.values(messages.reduce((acc, i) => {
    if (i.type === SOCKET_TYPES.WORLD_CHAT && !acc[i.hash_id]) {
        acc[i.hash_id] = i
    }

    return acc
}, {}))

export const htmlParseByMessages = (messages) => {
    const parser = new Parser()

    if(!Array.isArray(messages)) {
        messages = [messages]
    }

    return filterDublicateMessagesByHashId(messages).map((x) => {
        try {
            const htmlParser = parser.parseFragment(unicodeToChar(x.message))
            x.message = getChildNodesValue(htmlParser)
        } catch(err) {
            console.error(err)
            x.message = unicodeToChar(x.message)
        } finally {
            return x
        }
    })
}

export const GAME_RESOURCES = {
    MAX_LIMIT_SYMBOLS_MESSAGE: 80,
    bubble: {
        Affection_Buble: 36,
        Champion_Shopkeeper: 17,
        Default: '',
        Hanging_Amusement_Park: 16,
        Holiday_Fun: '',
        Midnight_Logic: 28,
        Past_Days: 26,
        Pawpaw_Dreamscape: 27,
        Proud_Blade: 13,
        Pumpkin_Party: 29,
        Set_off_Again: 31,
        Summer_Stream: 41,
        Together_Time: 22,
        Under_the_Thumb: 12,
        Vanity_of_Life: 30,
    },
    avatar: {
        NoAvatar: 'Avatar36',
        Claudia: 'Avatar35',
        Initial_Avatar_Famale: 'Avatar01',
        Initial_Avatar_Male: 'Avatar02',
        Shirli: '',
        Nemesis: '',
        Nemesis_Awakening: '',
        Samir: 'Avatar29',
        Pepper: '',
        Zeke_Awakening: '',
        Meryl: '',
        Echo: '',
        Bai_Ling: '',
        'Cabalt-B': '',
        Hilda: '',
        Cocoritter: '',
        KING: '',
        Zero: '',
        Alyss: '',
        Umi: '',
        Fenrir: '',
        Cobalt_B: '',
        Ruby: '',
        Tsubasa: '',
        Crow: '',
        Ene: '',
        Shiro: '',
        Huma: '',
        Frigg: 'Avatar05',
        Angel_Frigg: 'Avatar12',
        Alf: '',
        Peanut: 'Avatar14',
        Smarty: 'Avatar15',
        Mad_Dimon: 'Avatar16',
        Tartarus: 'Avatar17',
        Strawberry_Afternoon: 'Avatar22',
        Kitty_Coast: 'Avatar26',
        noname1: 'Avatar08',
        noname2: 'Avatar07',
        noname3: 'Avatar04',
        noname4: 'Avatar09',
        noname5: 'Avatar10',
        noname6: 'Avatar11',
        noname7: 'Avatar18',
        noname8: 'Avatar19',
        noname9: 'Avatar20',
        noname10: 'Avatar21',
        noname11: 'Avatar30', // --- repeat ?!
        noname12: 'Avatar34', // --- repeat ?!
    },
    frame: {
        Champion_Shopkeeper: 17,
        Metal: '',
        Wreath: '',
        Shining_Star: '03',
        Leader_of_Astra: '',
        Executor: 11,
        'Tower\'s_Core': 12,
        Gaze_Mirroria: 30,
        Salty_Wave: 40,
        Cordate_Jellybean: 35,
        Island_Fantasy: 25,
        Knight_of_Night: 26,
        Pawpaw_Treasure: 27,
        Pumpkin_Night: 28,
        Memories: 29,
        noname1: 23,
        noname2: 22,
        noname3: 20,
        noname4: '05',
        noname5: '06',
        noname6: '08',
        noname7: '09',
        noname8: 10,
        noname9: 13,
        noname10: 16,
        noname11: 18,
        naname12: 33,
        noname13: 34,
    },
    title: {
        '1_1_1_1': 'Astra Cartographer',
        '1_2_1_1': 'Soaring High',
        '1_1_2_1': 'Banges Apprentice',
        '1_1_3_1': 'Park Ranger',
        '1_3_1_1': 'Commander',
        '1_1_8_1': 'Extreme Climber',
        '1_1_8_2': 'Top Climber',
        '1_1_5_1': 'Snowfield Investigator',
    },
    suppressors: {
        '1.0': '1_0',   '3.4': '3_4',   '6.3': '6_3',
        '1.1': '1_1',   '3.5': '3_5',   '6.4': '6_4',
        '1.2': '1_2',   '4.1': '4_1',   '6.5': '6_5',
        '1.3': '1_3',   '4.2': '4_2',   '7.1': '7_1',
        '1.4': '1_4',   '4.3': '4_3',   '7.2': '7_2',
        '1.5': '1_5',   '4.4': '4_4',   '7.3': '7_3',
        '2.1': '2_1',   '4.5': '4_5',   '7.4': '7_4',
        '2.2': '2_2',   '5.1': '5_1',   '7.5': '7_5',
        '2.3': '2_3',   '5.2': '5_2',   '8.1': '8_1',
        '2.4': '2_4',   '5.3': '5_3',   '8.2': '8_2',
        '2.5': '2_5',   '5.4': '5_4',   '8.3': '8_3',
        '3.1': '3_1',   '5.5': '5_5',   '8.4': '8_4',
        '3.2': '3_2',   '6.1': '6_1',   '8.5': '8_5',
        '3.3': '3_3',   '6.2': '6_2',
    },
    sex: {
        famale: 0,
        male: 1,
    },
    colors: {
        LEGENDARY: {
            html: '<EmployNotice>$1</>',
        },
        EPIC: {
            html: '<hot textstyle="ItemQualityepic">$1</>',
        },
        BLUE: {
            html: '<hot textstyle="ItemQualityrare">$1</>',
        },
        RED: {
            html: '<Lblred>$1</>'
        },
        GREEN: {
            html: '<at>$1</>',
        },
        setTextColor: (text, { html }) => html.replace('$1', text)
    }
}
