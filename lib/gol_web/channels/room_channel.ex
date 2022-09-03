defmodule GolWeb.RoomChannel do
  use Phoenix.Channel

  @impl true
  def join("room:lobby", _message, socket) do
    {:ok, socket}
  end

  @impl true
  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  @impl true
  def handle_in("new_msg", %{"body" => body}, socket) do
    broadcast!(socket, "new_msg", %{body: body})
    {:noreply, socket}
  end
end
