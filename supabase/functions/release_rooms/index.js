export async function handler(req) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${Deno.env.get("SERVICE_ROLE_KEY")}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  );

  const today = new Date().toISOString().split("T")[0];

  // Get room IDs to update
  const { data: roomIds, error: fetchError } = await supabase
    .from("room_release_schedule")
    .select("room_id")
    .eq("release_date", today);

  if (fetchError) {
    return new Response("Failed to fetch rooms", { status: 500 });
  }

  if (roomIds.length === 0) {
    return new Response("No rooms to release today", { status: 200 });
  }

  const ids = roomIds.map((item) => item.room_id);

  const { error: updateError } = await supabase
    .from("rooms")
    .update({ status: "available" })
    .in("id", ids);

  if (updateError) {
    return new Response("Failed to update rooms", { status: 500 });
  }

  return new Response("Rooms updated successfully", { status: 200 });
}
