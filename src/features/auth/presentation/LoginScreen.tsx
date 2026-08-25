"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { useAuth } from "@/features/auth/presentation/AuthProvider";

export function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result === "success") {
        router.replace("/artigos");
        return;
      }

      setErrorMessage(
        result === "not_admin"
          ? "Acesso negado. Este usuário não possui permissão de administrador."
          : "E-mail ou senha inválidos.",
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível realizar o login.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box
      component="main"
      sx={{
        alignItems: "center",
        background: {
          xs: "linear-gradient(160deg, #fff8fa 0%, #f9dce4 100%)",
          md: "linear-gradient(110deg, #f8d7e0 0%, #fff8fa 52%, #f3becd 100%)",
        },
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        overflow: "hidden",
        p: { xs: 2, sm: 4 },
        position: "relative",
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          bgcolor: "primary.main",
          borderRadius: "50%",
          filter: "blur(2px)",
          height: { xs: 220, md: 420 },
          opacity: 0.12,
          position: "absolute",
          right: { xs: -120, md: -100 },
          top: { xs: -90, md: -170 },
          width: { xs: 220, md: 420 },
        }}
      />
      <Box
        aria-hidden="true"
        sx={{
          border: "1px solid",
          borderColor: "primary.main",
          borderRadius: "50%",
          bottom: { xs: -110, md: -190 },
          height: { xs: 240, md: 430 },
          left: { xs: -130, md: -160 },
          opacity: 0.24,
          position: "absolute",
          width: { xs: 240, md: 430 },
        }}
      />

      <Paper
        elevation={0}
        sx={{
          backdropFilter: "blur(18px)",
          bgcolor: "rgba(255, 255, 255, 0.88)",
          border: "1px solid rgba(197, 102, 130, 0.2)",
          color: "#2f2327",
          maxWidth: 460,
          p: { xs: 3, sm: 5 },
          position: "relative",
          width: "100%",
          "& .MuiInputBase-input": {
            color: "#2f2327",
          },
          "& .MuiInputLabel-root": {
            color: "#6f6267",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "primary.main",
          },
        }}
      >
        <Stack spacing={4}>
          <Stack spacing={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Box
              component="img"
              src={"/images/Logo-Menu-Rosa.png"}
              sx={{ width: 300, height: 75, mb: 1 }}
            />
            <Box>
              <Typography component="p" sx={{ color: "primary.main", fontWeight: 700, letterSpacing: 0.8 }}>
                MINHA SAUDE FEMININA
              </Typography>
              <Typography component="h1" sx={{ fontSize: { xs: "2rem", sm: "2.4rem" }, mt: 0.5 }} variant="h4">
                Bem-vinda de volta
              </Typography>
              <Typography sx={{ color: "#6f6267", mt: 1 }}>
                Acesse o painel para gerenciar os artigos do aplicativo.
              </Typography>
            </Box>
          </Stack>

          <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <TextField
              autoComplete="email"
              fullWidth
              label="E-mail"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              required
              slotProps={{ inputLabel: { shrink: true } }}
              type="email"
              value={email}
            />
            <TextField
              autoComplete="current-password"
              fullWidth
              label="Senha"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite sua senha"
              required
              type="password"
              slotProps={{ inputLabel: { shrink: true } }}
              value={password}
            />
            <Button
              disabled={isLoading}
              endIcon={isLoading ? undefined : <ArrowForwardRoundedIcon />}
              fullWidth
              size="large"
              sx={{ color: "common.white", minHeight: 50, mt: 0.5 }}
              type="submit"
              variant="contained"
            >
              {isLoading ? <CircularProgress color="inherit" size={24} /> : "Entrar"}
            </Button>
          </Stack>

          <Typography sx={{ color: "#6f6267", fontSize: "0.8rem", textAlign: "center" }}>
            Acesso administrativo ao Minha Saude Feminina
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
