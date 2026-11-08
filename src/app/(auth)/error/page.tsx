export default async function OauthError({
  params,
}: {
  params: Promise<{ error: string }>;
}) {
    const { error } = await params
  return <div>{error && <div>{error}</div>}</div>;
}
