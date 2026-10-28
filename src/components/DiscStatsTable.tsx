interface DiscStatsTableProps {
  slot4?: string;
  slot5?: string;
  slot6?: string;
  subs?: string;
}

export default function DiscStatsTable({ slot4, slot5, slot6, subs }: DiscStatsTableProps) {
  return (
    <table className="stats-table">
      <tbody>
        <tr>
          <td>Disc Slot 4:<br />{slot4 ?? "N/A"}</td>
          <td>Disc Slot 5:<br />{slot5 ?? "N/A"}</td>
          <td>Disc Slot 6:<br />{slot6 ?? "N/A"}</td>
        </tr>
        <tr>
          <td colSpan={3}>Sub Stats Recommended:<br />{subs ?? "N/A"}</td>
        </tr>
      </tbody>
    </table>
  );
}
