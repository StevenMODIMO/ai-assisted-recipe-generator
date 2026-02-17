export default async function RecipeGuide({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${slug}`,
  );
  const data = await response.json();
  //if (response.ok) console.log(data.meals);
  return <div>{slug}</div>;
}
