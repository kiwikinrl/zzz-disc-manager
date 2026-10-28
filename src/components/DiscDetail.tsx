import { getCharacterByName, getDiscImage } from "../lib/recommend";
import { getDisposalCandidates } from "../lib/dismantle";
import { getDismantleStats, getKeepStats } from "../lib/recommended-stats";
import HoverImage from "./HoverImage";
import DiscStatsTable from "./DiscStatsTable";
import type { Build, Disc, EquippedDisc, Recommendation } from "../lib/types";

interface DiscDetailProps {
  disc: Disc | null;
  discs: Disc[];
  recommendations: Recommendation[];
  builds: Build[];
  onSelectCharacter: (character: string) => void;
  onSelectDisc: (discSet: string) => void;
}

function formatStatList(stats: string[]): string {
  return stats.length > 0 ? stats.join(", ") : "None";
}

export default function DiscDetail({ disc, discs, recommendations, builds, onSelectCharacter, onSelectDisc }: DiscDetailProps) {
  if (!disc) {
    return (
      <section className="detail">
        <h2>Discs</h2>
        <div className="detail-section">
          <div className="item-grid">
            {discs.map((d) => (
              <div key={d.set} className="item-grid-item">
                <button type="button" className="item-grid-card" onClick={() => onSelectDisc(d.set)}>
                  <img src={getDiscImage(d)} alt={d.set} className="item-grid-img" />
                  <span className="item-grid-name">{d.set}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const discSet = disc.set;

  const recommendedFor = recommendations.filter((r) =>
    (r.disc ?? []).some(
      (o) =>
        o["4piece"] === discSet ||
        (o["recommend-2piece"] ?? []).includes(discSet) ||
        (o["other-2piece"] ?? []).includes(discSet),
    ),
  );

  const disposal: EquippedDisc[] = [];
  for (const rec of recommendedFor) {
    const build = builds.find((b) => b.name.toLowerCase() === rec.character.toLowerCase());
    if (!build) continue;
    const recommendedOption = (rec.disc ?? []).find(
      (o) => o["4piece"] === discSet || (o["recommend-2piece"] ?? []).includes(discSet) || (o["other-2piece"] ?? []).includes(discSet),
    ) ?? rec.disc?.[0];
    disposal.push(
      ...getDisposalCandidates(build.equippedDiscs, {
        recommendedFourPiece: recommendedOption?.["4piece"] ?? "",
        recommendedTwoPiece: recommendedOption?.["recommend-2piece"] ?? [],
        importantSubStats: rec.importantSubStats ?? [],
      }),
    );
  }

  const keepStats = getKeepStats(recommendedFor);
  const dismantleStats = getDismantleStats(keepStats);

  return (
    <section className="detail">
      <div className="detail-header">
        <div className="detail-header-img">
            <img src={getDiscImage(disc)} alt={disc.set} className="detail-image" />
        </div>

        <div className="detail-header-content">
            <h2>{disc.set}</h2>
            <div className="detail-header-meta disc-meta">
              <span><div>2-Piece Bonus:</div> {disc["2piece"] ?? "N/A"}</span>
              <span><div>4-Piece Bonus:</div> {disc["4piece"] ?? "N/A"}</span>
            </div>
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-block">
          <h3>Recommended Characters</h3>
          <ul>
            {recommendedFor.map((r) => {
              const character = getCharacterByName(r.character);
              const option = (r.disc ?? []).find(
                (o) => o["4piece"] === discSet || (o["recommend-2piece"] ?? []).includes(discSet) || (o["other-2piece"] ?? []).includes(discSet),
              );
              const isFourPiece = option?.["4piece"] === discSet;
              const isRecommendedTwoPiece = !isFourPiece && (option?.["recommend-2piece"] ?? []).includes(discSet);
              const usage = isFourPiece
                ? `4-piece ${discSet}`
                : isRecommendedTwoPiece
                  ? `recommended 2-piece ${discSet}`
                  : `alternative 2-piece ${discSet}`;
              return (
                <li key={r.character}>
                  <HoverImage src={character?.img ?? ""} alt={r.character}>
                    <button type="button" className="link-button" onClick={() => onSelectCharacter(r.character)}>
                      {r.character}
                    </button>
                  </HoverImage>{" "}
                  — {usage}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="detail-block">
          <h3>Stats Required by Characters</h3>
          {recommendedFor.length > 0 ? (
            recommendedFor.map((r) => {
              const character = getCharacterByName(r.character);
              return (
                <div key={r.character} className="detail-block">
                  <div>
                    <HoverImage src={character?.img ?? ""} alt={r.character}>
                      <button type="button" className="link-button" onClick={() => onSelectCharacter(r.character)}>
                        {r.character}
                      </button>
                    </HoverImage>
                  </div>
                  <h3>Recommended Disc Drives Stats:</h3>
                  <DiscStatsTable
                    slot4={r["disc-stat"]?.slot4}
                    slot5={r["disc-stat"]?.slot5}
                    slot6={r["disc-stat"]?.slot6}
                    subs={r["disc-stat"]?.subs}
                  />
                  {r.target.length > 0 ? 
                    <div>
                      <h3>Recommended Target Stats: </h3>
                      {r.target.map((target, index) => (
                        <div key={index}>{target}</div>
                      ))}
                    </div> : null}
                </div>
              );
            })
          ) : (
            <div className="detail-block">No Stats Available.</div>
          )}
        </div>
        <div className="detail-block">
          <h3>Recommend to Keep</h3>
          <div className="detail-header-meta">
            Keep based on All Stats Required by All Characters
          </div>
          <div className="detail-block">
            Disc Slot 4: {formatStatList(keepStats.slot4)}
          </div>
          <div className="detail-block">
            Disc Slot 5: {formatStatList(keepStats.slot5)}
          </div>
          <div className="detail-block">
            Disc Slot 6: {formatStatList(keepStats.slot6)}
          </div>
          <div className="detail-block">
            Sub Stats: {formatStatList(keepStats.subs)}
          </div>
        </div>
        <div className="detail-block">
          <h3>Recommend for Dismantle</h3>
          <div className="detail-header-meta">
              <span>Dismantle based on All Stats that are Not Required by All Characters</span>
          </div>
          <div className="detail-block">
            Disc Slot 4: {formatStatList(dismantleStats.slot4)}
          </div>
          <div className="detail-block">
            Disc Slot 5: {formatStatList(dismantleStats.slot5)}
          </div>
          <div className="detail-block">
            Disc Slot 6: {formatStatList(dismantleStats.slot6)}
          </div>
          <div className="detail-block">
            Sub Stats: {formatStatList(dismantleStats.subs)}
          </div>
        </div>
      </div>
    </section>
  );
}
