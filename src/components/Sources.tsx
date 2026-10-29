const sources: { name:string, link:string }[] = [
  { name: "Wiki", link: "https://zenless-zone-zero.fandom.com/wiki/" },
  { name: "Prydwen", link: "https://www.prydwen.gg/zenless/" },
]

export default function Sources(){
  return (
    <div className="ref-section">
      <h3>
        Information Provided By
      </h3>
      {sources.map((item) => (
        <a href={item.link} key={item.name}>
          {item.name}: {item.link}
        </a>
      ))}
    </div>
  );
}
