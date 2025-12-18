"use client";

import type { FormEvent } from "react";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Guest = {
  id: string;
  name: string;
  photoUrl: string;
  title: string;
  attendance: string;
  guests: number;
};

// TODO: Replace these with your real backend endpoints
const HOST_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:1337";

function HomeContent() {
  const searchParams = useSearchParams();
  const guestId = searchParams.get("id");

  const [guest, setGuest] = useState<Guest | null>(null);
  const [isLoadingGuest, setIsLoadingGuest] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!guestId) return;

    const fetchGuest = async () => {
      try {
        setIsLoadingGuest(true);
        setGuestError(null);

        // TODO: Update this fetch URL to match your backend API
        const res = await fetch(`${HOST_API_BASE_URL}/api/guests/${guestId}`);

        if (!res.ok) {
          throw new Error(`Failed to load guest: ${res.statusText}`);
        }

        const data = (await res.json()) as Guest;
        setGuest(data);
      } catch (error) {
        console.error(error);
        setGuestError("Không thể tải thông tin khách mời.");
      } finally {
        setIsLoadingGuest(false);
      }
    };

    fetchGuest();
  }, [guestId]);

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const attendance = (formData.get("attendance") as string) || "yes";
    const guestsValue = formData.get("guests") as string | null;
    const guests = guestsValue ? Number(guestsValue) : 0;

    if (!guestId) {
      console.error("Missing guest id, cannot submit RSVP");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch(`${HOST_API_BASE_URL}/api/guests/${guestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attendance,
          guests,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to submit RSVP: ${res.statusText}`);
      }

      // Try to use the updated guest from the API response if it exists,
      // otherwise just patch local state with the new RSVP values.
      try {
        const updated = (await res.json()) as Partial<Guest>;
        setGuest((prev) =>
          prev ? { ...prev, ...updated, attendance, guests } : prev
        );
      } catch {
        setGuest((prev) =>
          prev ? { ...prev, attendance, guests } : prev
        );
      }

      console.log("RSVP submitted:", { guestId, attendance, guests });
    } catch (error) {
      console.error("Failed to submit RSVP:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <main
        className="w-full min-h-screen max-w-[600px] bg-top bg-cover"
        style={{ backgroundImage: "url(/assets/images/background_sliver.png)" }}
      >
        <section id="hero">
          <img
            src="/assets/images/back.jpg"
            alt="kv"
            className="w-full h-full object-cover"
          />
        </section>

        <section id="guest" className="flex justify-center py-6 w-full">
          <div className="relative w-full rounded-[32px] py-5 px-8">
            {/* top invitation badge */}
            <div className="absolute top-[-18px] left-0 z-10 flex justify-center w-full min-w-[70%] mx-auto rotate-[-5deg]">
              <div className="rounded-[20px] px-4 py-2 pb-2 text-center border-2 border-[#2D2F2F] bg-[#5AB3B2]">
                <h2 className="text-[12px] tracking-[0.1em] text-white px-4 py-1 bg-[#2D2F2F] rounded-[14px] mb-0">
                  <span className="relative top-[2px]">YOU ARE INVITED</span>
                </h2>
                <div className="mt-1 py-1 flex items-end justify-center gap-1">
                  <span className="text-[10px] font-medium text-white opacity-80">
                    {guest?.title ?? "Mrs"}
                  </span>
                  <span
                    className="text-[18px] font-bold text-white tracking-wide"
                    style={{ lineHeight: 1 }}
                  >
                    {guest?.name ?? "TRAYCE GUEST"}
                  </span>
                </div>
              </div>
            </div>

            {/* guest photo */}
            {guest?.photoUrl ? (
              <img
                id="guest-image"
                src={guest?.photoUrl ? HOST_API_BASE_URL + guest.photoUrl : ""}
                alt={guest?.name ?? "guest"}
                className="relative z-5 mt-5 w-full max-w-xs mx-auto rounded-[24px] bg-[#2D2F2F] aspect-square object-cover object-center"
              />
            ) : (
              <div className="relative z-5 mt-5 w-full max-w-xs mx-auto rounded-[24px] bg-[#2D2F2F] aspect-square object-cover object-center"></div>
            )}
          </div>
        </section>
        <section id="schedule">
          <img
            src="/assets/images/schedule.png"
            alt="schedule"
            className="w-full h-full object-cover"
          />
        </section>
        <section id="rsvp" className="flex justify-center px-4 py-10 pb-14">
          {!guest?.attendance ? (
            <div className="w-full max-w-md">
              <h2 className="text-center text-xl font-semibold text-[#1e2b2f] mb-6">
                Bạn sẽ tham gia chứ?
              </h2>

              <form
                className="space-y-5 text-sm text-[#1e2b2f]"
                onSubmit={onFormSubmit}
              >
                <div className="flex justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="attendance"
                      value="yes"
                      className="h-4 w-4 rounded-full border border-[#2D2F2F] bg-transparent appearance-none checked:bg-[#2D2F2F] checked:border-[#2D2F2F] cursor-pointer"
                      defaultChecked
                    />
                    <span>Có, tôi sẽ tham gia!</span>
                  </label>

                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="attendance"
                      value="no"
                      className="h-4 w-4 rounded-full border border-[#2D2F2F] bg-transparent appearance-none checked:bg-[#2D2F2F] checked:border-[#2D2F2F] cursor-pointer"
                    />
                    <span>Xin lỗi, tôi bận mất rồi!</span>
                  </label>
                </div>

                <div className="flex justify-center items-center gap-2 mt-1">
                  <span className="text-sm mr-4">Bạn đi bao nhiêu người?</span>
                  <input
                    type="number"
                    min={0}
                    defaultValue={1}
                    name="guests"
                    className="w-32 rounded-sm border border-[#1e2b2f] bg-transparent px-3 py-1 text-center outline-none focus:ring-2 focus:ring-[#1e2b2f]"
                  />
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    type="submit"
                  disabled={isSubmitting}
                  className="w-56 rounded-full bg-[#1f1f1f] py-2 text-sm font-semibold tracking-wide text-white shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    "XÁC NHẬN"
                  )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="w-full max-w-md mx-auto rounded-3xl bg-[#00000080]/30 backdrop-blur-md px-6 py-8 text-center text-white shadow-xl border border-white/10">
              {guest?.attendance === "yes" ? (
                <>
                  <h3 className="text-3xl font-semibold tracking-wide uppercase">
                    Xin cảm ơn!
                  </h3>
                  <p className="text-base">
                    Bạn đã xác nhận <span className="font-semibold">tham dự</span>.
                  </p>
                  <div className="mt-5 inline-flex flex-col items-center justify-center rounded-2xl bg-white/10 px-5 py-3">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/80">
                      Số lượng người tham dự cùng bạn
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      {guest?.guests ? guest?.guests : 1}
                    </p>
                  </div>
                  <p className="mt-4 text-xs text-white/80">
                    Hẹn gặp bạn tại sự kiện!
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-3xl font-semibold tracking-wide uppercase">
                    Xin cảm ơn!
                  </h3>
                  <p className="mt-2 text-base">
                    Bạn đã xác nhận <span className="font-semibold">không tham dự</span>.
                  </p>
                  <p className="mt-3 text-sm text-white/80">
                    Cảm ơn bạn đã dành thời gian phản hồi. Hẹn gặp bạn trong dịp khác!
                  </p>
                </>
              )}
            </div>
          )}
        </section>
        <section id="timneline">
          <img
            src="/assets/images/timeline.png"
            alt="timeline"
            className="w-full h-full object-cover"
          />
        </section>
        <section id="footer">
          <img
            src="/assets/images/footer.png"
            alt="footer"
            className="w-full h-full object-cover"
          />
        </section>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-sm text-slate-700">Đang tải lời mời...</p>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
