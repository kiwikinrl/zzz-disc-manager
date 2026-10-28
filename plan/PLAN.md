# [Game Tool] ZZZ Disc Manager

Personal tool for managing game discs, allowing easier dismantling and keeping only necessary discs with required main & sub-stats only.

## Planned/Developed Components
### i) JSON as Database & Data Sources
- characters.json: List of Character with their info.
```json
[
    {
        "character": "Ellen Joe",
        "img": "https/local address",
        "faction": "Victoria Housekeeping",
        "attribute": "Ice",
        "specialty": "Attack",
        "rarity": "S"
    }, ...
]
```
- discs.json: List of Disc with their info.
```json
[
    {
        "set": "Shockstar Disco",
        "img": "https/local address",
        "2piece": "Impact +6%",
        "4piece": "Basic Attacks, Dash Attacks, and Dodge Counters inflict 20% more Daze to the main target."
    }, ...
]
```
- recommend.json: Recommend system for each characters, contains recommended engines, 4+2 disc types, main slot+sub stats, and target stats values.
```json
[
    {
        "character": "Anby",
        "engine": [], // Best to Least recommendation
        "disc": [ 
            {
                "4piece": "King of the Summit",
                "recommend-2piece": ["Shockstar Disco"], // Can have multiple as some disc 2-piece active bonuses is same. 
                "other-2piece": ["Shockstar Disco","Swing Jazz"] // Best to Least recommendation
            },
            {
                "4piece": "Astral Voice",
                "recommend-2piece": ["King of the Summit"],
                "other-2piece": ["Shockstar Disco", "Swing Jazz"]
            },
        ], // Best to Least recommendation
        "disc-stat":{
            "slot4": "CRIT Rate% >= CRIT DMG%", // store as string, decode later
            "slot5": "Electric DMG% > ATK%",
            "slot6": "Impact",
            "sub": "CRIT RATE = CRIT DMG > ATK% > PEN = ATK"
        },
        "target": [
            "Impact: 169 - 190+",
            "ATK: 1700 - 2000+ (Optional)",
            "HP: 9500+",...
        ]
    }, ...
]
```
- stats.json: Storing Main & Subs Stats Mapping.
```json
{
    "main":{ // available main stats for each slots
        "slot1":["Flat HP"],
        ...
        "slot6":["HP%", "ATK%",...],
    },
    "subs":[ // available stats for disc sub-stats
        "Flat HP",
        "Flat ATK",...
    ],
    "canonical":{ // used for mapping "recommend.json"."disc-stat" values.
        "atk": "Flat ATK",
        "hp": "Flat HP",...
    }
}
```
- images.json: used for rendering images.

### ii) Web App with UI
- Top Short Nav bar, left is Name of Application, Right is tabs (Character & Disc)
- Body with free-height but narrow left panel and wide right content body, where left side list:
  - a) Characters (in characters tab), right body with listing recommended disc-type (4+2) and recommended disc-stats based on character.
  - b) Disc (in disc tab), right body with:
    - Top section (short summary), listing recommended characters (include 2 section listing 4 or 2 disc type required by characters)
    - Middle section (detailed), listing each characters recommended main & stats, and target stats.
    - Bottom section (for keep & disposal), listing which main & subs stats that are needed / not needed by all characters.

### iii) Images Support
- Use link type to get image from other sites.

## Clarifications
### Disc slots & set bonuses ("4+2")
- When 2 discs of the same type/set are equipped, the 2-set bonus activates.
- When 4 discs of the same type/set are equipped, the 2-set & 4-set bonuses activate.
- Per developer clarification, this totals 3 active bonuses.

### Necessary/important stats (Refer stats.json)
(a) Main stats ("main"): which one of main stats for disc slot 4-6 are required/important, per character.  
(b) Sub stats ("subs"): which sub stats for all discs are required/important, per character.

## Development Items & Task List
### Item 1: Project Setup
- [x] Initialize Bun web app project structure.

### Item 2: Data Layer
- [x] Create JSON database.

### Item 3: Core Logic
- [x] Implement character-to-disc-type recommendation logic.
- [x] Implement dismantle/disposal suggestion logic.

### Item 4: Web App UI
- [x] Top nav bar: app name left, tabs right (Character & Disc).
- [x] Body layout: free-height narrow left panel + wide right content.
- [x] Characters tab: left character list -> right recommended disc-type (4+2) and stats.
- [x] Disc tab: op / detailed / keep & disposal sections.

### Item 5: Images & Local JSON
- [x] Image link import support.
- [x] Local JSON import/export (placeholder)

## System Design Rule
- Before starting development, ask question/give suggestion if things didn't written/plan out, so that future development could be easier.
- Make the system modular, flexible and easy to expand/upgrade. You can use Bun to create the web app.
- In addition, ask developer if any question, suggest improvement, conflicts, etc.