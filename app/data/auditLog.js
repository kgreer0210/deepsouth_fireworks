// Works with both client and server Supabase instances
export async function logAction(supabase, userId, actionType, details) {
  const { error } = await supabase.from('actions_log').insert({
    user_id: userId,
    action_type: actionType,
    action_details: details,
  });
  if (error) {
    console.warn('[auditLog] Failed to log action:', actionType, error.message);
  }
}
