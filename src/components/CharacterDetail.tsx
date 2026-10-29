import { getDiscImage, getDiscBySet, getImageForCategory, getRecommendationsByCharacter, getRecommendedSets } from "../lib/recommend";
import HoverImage from "./HoverImage";
import DiscStatsTable from "./DiscStatsTable";
import SearchInput from "./SearchInput";
import Sources from "./Sources";
import type { Character } from "../lib/types";

interface CharacterDetailProps {
  character: Character | null;
  characters: Character[];
  onSelectCharacter: (character: string) => void;
  onSelectDisc: (discSet: string) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  onFilter?: () => void;
}

interface DiscRefProps {
  discSet: string;
  onSelectDisc: (discSet: string) => void;
}

function DiscRef({ discSet, onSelectDisc }: DiscRefProps) {
  return (
    <HoverImage src={getDiscImage(getDiscBySet(discSet))} alt={discSet}>
      <button type="button" className="link-button" onClick={() => onSelectDisc(discSet)}>
        {discSet}
      </button>
    </HoverImage>
  );
}

export default function CharacterDetail({
  character,
  characters,
  onSelectCharacter,
  onSelectDisc,
  search = "",
  onSearchChange = () => undefined,
  onFilter,
}: CharacterDetailProps) {
  if (!character) {
    return (
      <section className="detail">
        <h2>Characters</h2>
        <div className="detail-section">
          <div className="panel-search">
            <SearchInput value={search} onChange={onSearchChange} placeholder="Character" onFilter={onFilter} />
          </div>
          <div className="item-grid">
            {characters.map((c) => (
              <div key={c.character} className="item-grid-item">
                <button type="button" className="item-grid-card" onClick={() => onSelectCharacter(c.character)}>
                  <img src={c.img} alt={c.character} className="item-grid-img" loading="lazy"/>
                  <span className="item-grid-name">{c.character}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const recommendations = getRecommendationsByCharacter(character.character);
  const recommendation = recommendations[0];
  const recommendedSets = recommendation ? getRecommendedSets(recommendation) : null;

  return (
    <section className="detail">
      <div className="detail-header">
        <div className="detail-header-img">
          <img src={character.img} alt={character.rarity} className="detail-image" loading="lazy"/>
        </div>

        <div className="detail-header-content">
          <div className="detail-header-title">
            <h2>{character.character}</h2>
            <div>
              {getImageForCategory("faction", character.faction) ? (
                <img src={getImageForCategory("faction", character.faction)} alt={character.faction} className="detail-subimage" loading="lazy"/>
              ) : null}
              {getImageForCategory("attribute", character.attribute) ? (
                <img src={getImageForCategory("attribute", character.attribute)} alt={character.attribute} className="detail-subimage" loading="lazy"/>
              ) : null}
              {getImageForCategory("specialty", character.specialty) ? (
                <img src={getImageForCategory("specialty", character.specialty)} alt={character.specialty} className="detail-subimage" loading="lazy"/>
              ) : null}
            </div>
          </div>

          <div className="detail-header-meta">
            <span>Attribute: {character.attribute}</span>
            <span>Specialty: {character.specialty}</span> 
            <span>Rarity: {character.rarity}</span>
            <span>Faction: {character.faction}</span>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-block">
            <h3>Recommended Disc Drives Sets</h3>
              {recommendedSets && recommendedSets.length > 0 ? (
                recommendedSets.map((set) => (
                  <div className="detail-block" key={`${character.character}-${set.fourPiece}`}>
                    <div>4-piece: <DiscRef discSet={set.fourPiece} onSelectDisc={onSelectDisc} /></div>
                    <div>
                      Recommended 2-piece:{" "}
                      {set.twoPiece.length > 0 ? (
                        set.twoPiece.map((d, index) => (
                          <span key={d}>
                            {index > 0 ? ", " : ""}
                            <DiscRef discSet={d} onSelectDisc={onSelectDisc} />
                          </span>
                        ))
                      ) : (
                        "None"
                      )}
                    </div>
                    {set.otherTwoPiece.length > 0 ? (
                      <div>
                        Alternative 2-piece:{" "}
                        {set.otherTwoPiece.map((d, index) => (
                          <span key={d}>
                            {index > 0 ? ", " : ""}
                            <DiscRef discSet={d} onSelectDisc={onSelectDisc} />
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="detail-block">No Sets Available.</div>
              )}
        </div>
        
        <div className="detail-block">
          <h3>Recommended Disc Drives Stats</h3>
            {recommendation ? (
              <DiscStatsTable
                slot4={recommendation["disc-stat"]?.slot4}
                slot5={recommendation["disc-stat"]?.slot5}
                slot6={recommendation["disc-stat"]?.slot6}
                subs={recommendation["disc-stat"]?.subs}
              />
            ) : (
            <div className="detail-block">No Disc Stats Available.</div>
          )}
        </div>
        
        <div className="detail-block">
          <h3>Recommended Target Stats: </h3>
            {recommendation ? (
              <div>
                {recommendation.target.length > 0 ? (
                  <div>
                    {recommendation.target.map((target, index) => (
                      <div key={index}>{target}</div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
            <div className="detail-block">No Stats Available.</div>
          )}
        </div>
        <Sources />
      </div>
    </section>
  );
}
