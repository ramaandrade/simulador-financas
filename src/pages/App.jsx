import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import Login from './pages/Login';
import Admin from './pages/Admin';
import Menu from './pages/Menu';
import MarmitariaDashboard from './pages/MarmitariaDashboard';
import Marmitaria from './pages/Marmitaria';
import MarmitariaPrecificacao from './pages/MarmitariaPrecificacao';
import MarmitariaCapitalGiro from './pages/MarmitariaCapitalGiro';
import MarmitariaPlanejamento from './pages/MarmitariaPlanejamento';
import MarmitariaFinanciamento from './pages/MarmitariaFinanciamento';
import MarmitariaInvestimentos from './pages/MarmitariaInvestimentos';
import MarmitariaIndicadores from './pages/MarmitariaIndicadores';
import MarmitariaExercicios from './pages/MarmitariaExercicios';
import MarmitariaConsultoriaCustos from './pages/MarmitariaConsultoriaCustos';
import MarmitariaConsultoriaPrecificacao from './pages/MarmitariaConsultoriaPrecificacao';
import PadariaConsultoriaCustos from './pages/PadariaConsultoriaCustos';
import PadariaConsultoriaPrecificacao from './pages/PadariaConsultoriaPrecificacao';
import ModaConsultoriaCustos from './pages/ModaConsultoriaCustos';
import ModaConsultoriaPrecificacao from './pages/ModaConsultoriaPrecificacao';
import MarmitariaConsultoriaCapitalGiro from './pages/MarmitariaConsultoriaCapitalGiro';
import MarmitariaConsultoriaPlanejamento from './pages/MarmitariaConsultoriaPlanejamento';
import MarmitariaConsultoriaFinanciamento from './pages/MarmitariaConsultoriaFinanciamento';
import MarmitariaConsultoriaInvestimentos from './pages/MarmitariaConsultoriaInvestimentos';
import MarmitariaConsultoriaIndicadores from './pages/MarmitariaConsultoriaIndicadores';
import PadariaConsultoriaCapitalGiro from './pages/PadariaConsultoriaCapitalGiro';
import PadariaConsultoriaPlanejamento from './pages/PadariaConsultoriaPlanejamento';
import PadariaConsultoriaFinanciamento from './pages/PadariaConsultoriaFinanciamento';
import PadariaConsultoriaInvestimentos from './pages/PadariaConsultoriaInvestimentos';
import PadariaConsultoriaIndicadores from './pages/PadariaConsultoriaIndicadores';
import ModaConsultoriaCapitalGiro from './pages/ModaConsultoriaCapitalGiro';
import ModaConsultoriaPlanejamento from './pages/ModaConsultoriaPlanejamento';
import ModaConsultoriaFinanciamento from './pages/ModaConsultoriaFinanciamento';
import ModaConsultoriaInvestimentos from './pages/ModaConsultoriaInvestimentos';
import ModaConsultoriaIndicadores from './pages/ModaConsultoriaIndicadores';
import DesafiosAvancados from './pages/DesafiosAvancados';
import MetodosPrecificacao from './pages/MetodosPrecificacao';
import ConsultoriaFarmacia from './pages/ConsultoriaFarmacia';
import ConsultoriaBarbearia from './pages/ConsultoriaBarbearia';
import ConsultoriaRestaurante from './pages/ConsultoriaRestaurante';
import MarmitariaNF from './pages/MarmitariaNF';
import MarmitariaRegimes from './pages/MarmitariaRegimes';
import PadariaDashboard from './pages/PadariaDashboard';
import PadariaCustos from './pages/PadariaCustos';
import PadariaPrecificacao from './pages/PadariaPrecificacao';
import PadariaCapitalGiro from './pages/PadariaCapitalGiro';
import PadariaPlanejamento from './pages/PadariaPlanejamento';
import PadariaFinanciamento from './pages/PadariaFinanciamento';
import PadariaInvestimentos from './pages/PadariaInvestimentos';
import PadariaIndicadores from './pages/PadariaIndicadores';
import ModaDashboard from './pages/ModaDashboard';
import ModaCustos from './pages/ModaCustos';
import ModaPrecificacao from './pages/ModaPrecificacao';
import ModaCapitalGiro from './pages/ModaCapitalGiro';
import ModaPlanejamento from './pages/ModaPlanejamento';
import ModaFinanciamento from './pages/ModaFinanciamento';
import ModaInvestimentos from './pages/ModaInvestimentos';
import ModaIndicadores from './pages/ModaIndicadores';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          } />

          <Route path="/" element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          } />

          <Route path="/marmitaria" element={
            <ProtectedRoute>
              <MarmitariaDashboard />
            </ProtectedRoute>
          } />

          <Route path="/marmitaria/custos" element={
            <ProtectedRoute>
              <Marmitaria />
            </ProtectedRoute>
          } />

          <Route path="/marmitaria/precificacao" element={
            <ProtectedRoute>
              <MarmitariaPrecificacao />
            </ProtectedRoute>
          } />

          <Route path="/marmitaria/capital-giro" element={
            <ProtectedRoute>
              <MarmitariaCapitalGiro />
            </ProtectedRoute>
          } />

          <Route path="/marmitaria/planejamento" element={
            <ProtectedRoute>
              <MarmitariaPlanejamento />
            </ProtectedRoute>
          } />

          <Route path="/marmitaria/financiamento" element={
            <ProtectedRoute>
              <MarmitariaFinanciamento />
            </ProtectedRoute>
          } />

          <Route path="/marmitaria/investimentos" element={
            <ProtectedRoute>
              <MarmitariaInvestimentos />
            </ProtectedRoute>
          } />

          <Route path="/marmitaria/indicadores" element={
            <ProtectedRoute>
              <MarmitariaIndicadores />
            </ProtectedRoute>
          } />

          <Route path="/marmitaria/metodos-precificacao" element={<ProtectedRoute><MetodosPrecificacao /></ProtectedRoute>} />
          <Route path="/marmitaria/consultoria-custos" element={<ProtectedRoute><MarmitariaConsultoriaCustos /></ProtectedRoute>} />
          <Route path="/marmitaria/consultoria-precificacao" element={<ProtectedRoute><MarmitariaConsultoriaPrecificacao /></ProtectedRoute>} />
          <Route path="/marmitaria/consultoria-capital-giro" element={<ProtectedRoute><MarmitariaConsultoriaCapitalGiro /></ProtectedRoute>} />
          <Route path="/marmitaria/consultoria-planejamento" element={<ProtectedRoute><MarmitariaConsultoriaPlanejamento /></ProtectedRoute>} />
          <Route path="/marmitaria/consultoria-financiamento" element={<ProtectedRoute><MarmitariaConsultoriaFinanciamento /></ProtectedRoute>} />
          <Route path="/marmitaria/consultoria-investimentos" element={<ProtectedRoute><MarmitariaConsultoriaInvestimentos /></ProtectedRoute>} />
          <Route path="/marmitaria/consultoria-indicadores" element={<ProtectedRoute><MarmitariaConsultoriaIndicadores /></ProtectedRoute>} />

          <Route path="/padaria/consultoria-custos" element={<ProtectedRoute><PadariaConsultoriaCustos /></ProtectedRoute>} />
          <Route path="/padaria/consultoria-precificacao" element={<ProtectedRoute><PadariaConsultoriaPrecificacao /></ProtectedRoute>} />
          <Route path="/padaria/consultoria-capital-giro" element={<ProtectedRoute><PadariaConsultoriaCapitalGiro /></ProtectedRoute>} />
          <Route path="/padaria/consultoria-planejamento" element={<ProtectedRoute><PadariaConsultoriaPlanejamento /></ProtectedRoute>} />
          <Route path="/padaria/consultoria-financiamento" element={<ProtectedRoute><PadariaConsultoriaFinanciamento /></ProtectedRoute>} />
          <Route path="/padaria/consultoria-investimentos" element={<ProtectedRoute><PadariaConsultoriaInvestimentos /></ProtectedRoute>} />
          <Route path="/padaria/consultoria-indicadores" element={<ProtectedRoute><PadariaConsultoriaIndicadores /></ProtectedRoute>} />

          <Route path="/moda/consultoria-custos" element={<ProtectedRoute><ModaConsultoriaCustos /></ProtectedRoute>} />
          <Route path="/moda/consultoria-precificacao" element={<ProtectedRoute><ModaConsultoriaPrecificacao /></ProtectedRoute>} />
          <Route path="/moda/consultoria-capital-giro" element={<ProtectedRoute><ModaConsultoriaCapitalGiro /></ProtectedRoute>} />
          <Route path="/moda/consultoria-planejamento" element={<ProtectedRoute><ModaConsultoriaPlanejamento /></ProtectedRoute>} />
          <Route path="/moda/consultoria-financiamento" element={<ProtectedRoute><ModaConsultoriaFinanciamento /></ProtectedRoute>} />
          <Route path="/moda/consultoria-investimentos" element={<ProtectedRoute><ModaConsultoriaInvestimentos /></ProtectedRoute>} />
          <Route path="/moda/consultoria-indicadores" element={<ProtectedRoute><ModaConsultoriaIndicadores /></ProtectedRoute>} />

          <Route path="/desafios-avancados" element={
            <ProtectedRoute>
              <DesafiosAvancados />
            </ProtectedRoute>
          } />
          <Route path="/desafios-avancados/farmacia" element={<ProtectedRoute><ConsultoriaFarmacia /></ProtectedRoute>} />
          <Route path="/desafios-avancados/barbearia" element={<ProtectedRoute><ConsultoriaBarbearia /></ProtectedRoute>} />
          <Route path="/desafios-avancados/restaurante" element={<ProtectedRoute><ConsultoriaRestaurante /></ProtectedRoute>} />

          <Route path="/marmitaria/exercicios" element={
            <ProtectedRoute requiredRole="admin">
              <MarmitariaExercicios />
            </ProtectedRoute>
          } />

          <Route path="/marmitaria/nf" element={
            <ProtectedRoute requiredRole="admin">
              <MarmitariaNF />
            </ProtectedRoute>
          } />

          <Route path="/marmitaria/regimes" element={
            <ProtectedRoute requiredRole="admin">
              <MarmitariaRegimes />
            </ProtectedRoute>
          } />

          <Route path="/padaria" element={
            <ProtectedRoute>
              <PadariaDashboard />
            </ProtectedRoute>
          } />

          <Route path="/padaria/custos" element={
            <ProtectedRoute>
              <PadariaCustos />
            </ProtectedRoute>
          } />

          <Route path="/padaria/precificacao" element={
            <ProtectedRoute>
              <PadariaPrecificacao />
            </ProtectedRoute>
          } />

          <Route path="/padaria/capital" element={
            <ProtectedRoute>
              <PadariaCapitalGiro />
            </ProtectedRoute>
          } />

          <Route path="/padaria/planejamento" element={
            <ProtectedRoute>
              <PadariaPlanejamento />
            </ProtectedRoute>
          } />

          <Route path="/padaria/financiamento" element={
            <ProtectedRoute>
              <PadariaFinanciamento />
            </ProtectedRoute>
          } />

          <Route path="/padaria/investimentos" element={
            <ProtectedRoute>
              <PadariaInvestimentos />
            </ProtectedRoute>
          } />

          <Route path="/padaria/indicadores" element={
            <ProtectedRoute>
              <PadariaIndicadores />
            </ProtectedRoute>
          } />

          {/* TRILHA LOJA DE MODA JOVEM */}
          <Route path="/moda" element={
            <ProtectedRoute>
              <ModaDashboard />
            </ProtectedRoute>
          } />

          <Route path="/moda/custos" element={
            <ProtectedRoute>
              <ModaCustos />
            </ProtectedRoute>
          } />

          <Route path="/moda/precificacao" element={
            <ProtectedRoute>
              <ModaPrecificacao />
            </ProtectedRoute>
          } />

          <Route path="/moda/capital" element={
            <ProtectedRoute>
              <ModaCapitalGiro />
            </ProtectedRoute>
          } />

          <Route path="/moda/planejamento" element={
            <ProtectedRoute>
              <ModaPlanejamento />
            </ProtectedRoute>
          } />

          <Route path="/moda/financiamento" element={
            <ProtectedRoute>
              <ModaFinanciamento />
            </ProtectedRoute>
          } />

          <Route path="/moda/investimentos" element={
            <ProtectedRoute>
              <ModaInvestimentos />
            </ProtectedRoute>
          } />

          <Route path="/moda/indicadores" element={
            <ProtectedRoute>
              <ModaIndicadores />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
// Force HMR reload
