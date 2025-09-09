import { NgModule } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { PreloadAllModules, Router, RouterModule, Routes } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { map, take, tap } from 'rxjs';
import { RoleguardService } from './service/roleguard.service';
import { TabsPagePage } from './pages/tabs-page/tabs-page.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    component: TabsPagePage,  // Usa el componente de tabs como contenedor
    children: [
      {
        path: 'folder/:uid',
        loadChildren: () => import('./pages/folder/folder.module').then(m => m.FolderPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('./pages/perfil/perfil.module').then(m => m.PerfilPageModule)
      },
      {
        path: 'cita',
        loadChildren: () => import('./pages/cita/cita.module').then( m => m.CitaPageModule)
      },
      {
        path: 'favoritos',
        loadChildren: () => import('./pages/favoritos/favoritos.module').then( m => m.FavoritosPageModule)
      },
      {
        path: 'noticias',
        loadChildren: () => import('./pages/noticias/noticias.module').then( m => m.NoticiasPageModule)
      },
    ]
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'terminos',
    loadChildren: () => import('./pages/terminos/terminos.module').then( m => m.TerminosPageModule)
  },
  {
    path: 'cuenta',
    loadChildren: () => import('./pages/cuenta/cuenta.module').then( m => m.CuentaPageModule)
  },
  {
    path: 'mapa',
    loadChildren: () => import('./pages/mapa/mapa.module').then( m => m.MapaPageModule)
  },
  {
    path: 'tabs-page',
    loadChildren: () => import('./pages/tabs-page/tabs-page.module').then( m => m.TabsPagePageModule)
  },
  {
    path: 'tatuador/:uid',
    loadChildren: () => import('./pages/tatuador/tatuador.module').then( m => m.TatuadorPageModule)
  },
  {
    path: 'pedir-cita/:uid',
    loadChildren: () => import('./pages/pedir-cita/pedir-cita.module').then( m => m.PedirCitaPageModule)
  },
  {
    path: 'ajustes/:uid',
    loadChildren: () => import('./pages/ajustes/ajustes.module').then( m => m.AjustesPageModule)
  },
  {
    path: 'eventos',
    loadChildren: () => import('./pages/eventos/eventos.module').then( m => m.EventosPageModule)
  },
  {
    path: 'ofertas',
    loadChildren: () => import('./pages/ofertas/ofertas.module').then( m => m.OfertasPageModule)
  },
  {
    path: 'pago',
    loadChildren: () => import('./pages/pago/pago.module').then( m => m.PagoPageModule)
  },

  




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
