export default function ModelBadge({ model }: { model: string }) {
    const color =
        model === "Gemini"
            ? "bg-green-100 text-green-700"
            : "bg-orange-100 text-orange-700";

    return (
        <span className={`px-3 py-1 rounded-full text-sm ${color}`}>
            {model}
        </span>
    );
}