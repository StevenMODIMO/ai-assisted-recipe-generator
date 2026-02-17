import RecipeHeader from "@/components/recipe-header";

export default function RecipeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <RecipeHeader />
      {children}
    </div>
  );
}
