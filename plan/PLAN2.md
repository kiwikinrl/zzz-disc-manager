### Item 6: Clickable navigation
- [x] Inside of any Character page, "Recommended Disc Drives Sets" contains a list of discs; each is clickable and navigates to the corresponding Disc page with that disc selected.
- [x] Inside of any Disc page, "Recommended Characters" and "Stats Required by Characters" contain a list of characters; each is clickable and navigates to the corresponding Character page with that character selected.

### Item 7: Hover feedback for clickables
- [x] For both clickable/navigable entries, add a hover effect that shows a small dialog with the item's image. (Custom hover dialog component; applied to new clickable entries only.)
- [x] Dynamic & Live Positioning, move following cursor position & consider window border (show at invert position when no spaces)

### Item 8: Stats display (table)
- [x] "Recommended Disc Drives Stats" & "Stats Required by Characters":
  - [x] First row: 3 columns listing disc slot numbers & recommended main stats.
  - [x] Second row: 1 column, value as "Sub Stats Recommended:...".

### Item 9: Default tab view
- [x] When no item is selected, the detail section shows all items in a grid style: image on top, name below, each clickable. Only show panel when any item is clicked.

### Item 10: Sorter for Character & Discs (A - Z)
- [x] Always sorted A - Z (left panel lists & default tab view grid).

### Item 11: Search
- [x] Add real-time search for Disc/Character support for with a clear "x" button within the right side of the search textbox. 
  - [x] Left panel,
  - [x] Default tab view grid,
- [x] Add Filter button: as button placeholder first (core logic implement later)

### Item 12: Grid view as whole
- [x] When no item is selected in grid view (especially first start up), hide left panel and show grid view + search bar only, as they show the same images and item name.

## Bug Check & Fix
- [x] In the Disc tab of Recommended Characters, when a disc is selected, some characters' 2-piece recommendations fail to be recognized/displayed.

## Developer TO-DO List
- [x] Add images link for each item.  
- [x] Create stats.json with disc drive stats in structural format (include main & subs).  
- [x] Style table for characters."Stats Required by Characters" 
- [x] Update character & recommend JSON to support stats.json, used for "Recommend to Keep" and "Recommend for Dismantle" calculations.
- [ ] Add height limit & scroll for characters."Recommended Disc Drives Sets", disc."Recommended Characters"+"Stats Required by Characters"  
- [ ] Add System Wide Credit Information
- [Planning] Plan for filter button actions & logics.
- [Planning] Redesign Discs Tab Recommendation Section
  - Recommend to Keep & for Dismantle in same line
- [Planning] Mobile View

## Recommend System Implementation Plan:
### Disc Drive Stats System
 - "src/resources/stats.json" is ready, this represent sets of selectable stats for each disc slot & sub stat.
 - For each disc, only 1 main stat & 4 subs stats will be randomly chosen, based on character needs.

### 'Stats Required by Characters' Data Layer
- The data layer is complete and contains the source data that will assist the calculation.
- List of characters will be shown with selected specific disc type, with each character "Recommended Disc Drives Stats".

### Canonical Key:
- "recommend.json" & "stats.json" sometime used different stat name but same meaning.
- Use "stats.json"."canonical" data for mapping stat name in "recommend.json"."disc-stat" values.
- If any Character has "Fire/Ice/... DMG%", keep the original name for "Keep" section, if not, show as "Attribute DMG Bonus%" in "Dismentle" section.

### Implementation Approach:
- Gather the union of stats across all characters, and implement:
a) "Recommend to Keep" section (aka keep-list):
 - Extract stat name (CRIT Rate%, Flat ATK, ...) using "src/resources/stats.json"; ignore >, = symbols & parenthetical notes, if present.
 - Group the values extracted and store into each respective section(s) ("Disc Slot #", "Sub Stats").

b) "Recommend for Dismantle" section:
 - Subtract the keep-list from the selectable stats base (from "stats.json") for each respective section.
 - Example: ( List of selectable stats from "stats.json" for slot 4 ) - ( List of stats gathered in "Recommend to Keep" for slot 4 ) = remaining stats that are not needed by any characters.
 - Store the remaining values into each respective section(s) ("Disc Slot #", "Sub Stats").