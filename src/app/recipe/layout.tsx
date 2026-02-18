import RecipeHeader from "@/components/recipe-header";

export default function RecipeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-6 py-6">
      <RecipeHeader />
      {children}
    </div>
  );
}
