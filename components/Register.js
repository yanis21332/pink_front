"use client";

import { useState } from "react";
import styled from "styled-components";
import { AUTH_COOKIE_NAME } from "../lib/auth";
import { loginUser } from "../lib/api";
import { API } from "../lib/data";

const AuthPage = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background:
    radial-gradient(circle at top, rgba(179, 137, 91, 0.15), transparent 28%),
    radial-gradient(
      circle at bottom right,
      rgba(178, 59, 59, 0.1),
      transparent 32%
    ),
    var(--paper);
`;

const AuthCard = styled.div`
  width: min(520px, 100%);
  background: rgba(251, 248, 243, 0.98);
  border: 1px solid rgba(27, 22, 19, 0.08);
  box-shadow: var(--shadow);
  border-radius: 28px;
  padding: 42px 40px;
  display: grid;
  gap: 28px;
`;

const Header = styled.div`
  display: grid;
  gap: 10px;
`;

const Eyebrow = styled.div`
  font-family: var(--font-ibm-mono), "IBM Plex Mono", monospace;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 11px;
  color: var(--ink-dim);
`;

const Title = styled.h1`
  font-family: var(--font-fraunces), "Fraunces", serif;
  font-size: clamp(2.1rem, 3vw, 2.6rem);
  line-height: 1.05;
  color: var(--noir);
`;

const Description = styled.p`
  font-family: var(--font-manrope), "Manrope", sans-serif;
  color: var(--ink-dim);
  line-height: 1.75;
  max-width: 36rem;
`;

const Form = styled.form`
  display: grid;
  gap: 18px;
`;

const FieldGroup = styled.div`
  display: grid;
  gap: 8px;
`;

const Label = styled.label`
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 0.9rem;
  color: var(--ink-dim);
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--blanc);
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 1rem;
  color: var(--ink);
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    border-color: var(--beige);
    box-shadow: 0 0 0 4px rgba(179, 137, 91, 0.12);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px 18px;
  border-radius: 14px;
  border: none;
  background: var(--noir);
  color: var(--blanc);
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Feedback = styled.div`
  color: var(--rouge);
  font-family: var(--font-manrope), "Manrope", sans-serif;
  font-size: 0.95rem;
`;

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError(
        "Veuillez renseigner votre nom d’utilisateur et votre mot de passe.",
      );
      return;
    }

    setLoading(true);

    const res = await loginUser(username, password);
    if(!res.ok) {

      setError(res.error || "Erreur de connexion.");
      setLoading(false);
      return;
    }
    setLoading(false);
    window.location.href = '/';
  };

  return (
    <AuthPage>
      <AuthCard>
        <Header>
          <Eyebrow>Accès administrateur</Eyebrow>
          <Title>Connexion à Pink Studio</Title>
          <Description>
            Entrez votre nom d’utilisateur et votre mot de passe pour accéder à
            la gestion des rendez-vous.
          </Description>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FieldGroup>
            <Label htmlFor="username">Nom d’utilisateur</Label>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Ex: marine.lucas"
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </FieldGroup>

          {error && <Feedback>{error}</Feedback>}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </SubmitButton>
        </Form>
      </AuthCard>
    </AuthPage>
  );
}
