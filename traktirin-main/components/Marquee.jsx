const TEXT =
  "Praktikum Pertemuan 13: build, deploy, dan pantau aplikasi Next.js kamu. Jangan commit secret ke GitHub!";

export default function Marquee() {
  return (
    <div className="marquee" role="note">
      <div className="marquee__track">
        <span>{TEXT}</span>
        <span aria-hidden="true">{TEXT}</span>
      </div>
    </div>
  );
}
