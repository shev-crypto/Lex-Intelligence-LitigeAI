import { useParams } from "react-router-dom";

export default function MatterDetail() {
  const { id } = useParams();
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-heading">Matter Detail</h1>
      <p className="text-muted-foreground">Matter ID: {id} — coming soon.</p>
    </div>
  );
}
