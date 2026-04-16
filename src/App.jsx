import { useState, useEffect } from "react";
import * as OTPAuth from "otpauth";
import background from "./assets/bg.png";

export default function App() {
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("------");
  const [timeLeft, setTimeLeft] = useState(30);

  const generateCode = () => {
    if (!secret.trim()) {
      setCode("------");
      return;
    }

    try {
      const cleanSecret = secret.replace(/\s+/g, "");

      const totp = new OTPAuth.TOTP({
        secret: cleanSecret,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
      });

      const generated = totp.generate();
      setCode(generated);
    } catch {
      setCode("Erro");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const epoch = Math.floor(Date.now() / 1000);
      const remaining = 30 - (epoch % 30);
      setTimeLeft(remaining);

      if (secret.trim()) {
        generateCode();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [secret]);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Arial",
      }}
    >
      <img
        src={background}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          gap: "14px",
          backgroundColor: "rgba(0,0,0,0.45)",
          padding: "24px 28px",
          borderRadius: "18px",
          color: "white",
        }}
      >
        <h1 style={{ margin: 0 }}>Zezin2FA</h1>

        <input
          type="text"
          placeholder="Digite a chave secreta Base32"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          style={{
            padding: "12px",
            width: "280px",
            borderRadius: "8px",
            border: "none",
          }}
        />

        <button
          onClick={generateCode}
          style={{
            padding: "12px 18px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Gerar código
        </button>

        <h2 style={{ margin: 0 }}>{code}</h2>
        <p style={{ margin: 0 }}>Expira em {timeLeft}s</p>
      </div>
    </div>
  );
}