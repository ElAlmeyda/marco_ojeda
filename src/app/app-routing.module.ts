import { NgModule } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { PreloadAllModules, Router, RouterModule, Routes } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { map, take, tap } from 'rxjs';
import { RoleguardService } from './service/roleguard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder',
    pathMatch: 'full'
  },
  {
    path: 'editar-perfil',
    loadChildren: () => import('./pages/editar-perfil/editar-perfil.module').then( m => m.EditarPerfilPageModule)
  },
  {
    path: 'equipo',
    loadChildren: () => import('./pages/equipo/equipo.module').then( m => m.EquipoPageModule)
  },
  {
    path: 'folder',
    loadChildren: () => import('./pages/folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'inicio-sesion',
    loadChildren: () => import('./pages/inicio-sesion/inicio-sesion.module').then( m => m.InicioSesionPageModule)
  },
  {
    path: 'noticias',
    loadChildren: () => import('./pages/noticias/noticias.module').then( m => m.NoticiasPageModule)
  },
  {
    path: 'tienda-dental',
    loadChildren: () => import('./pages/tienda-dental/tienda-dental.module').then( m => m.TiendaDentalPageModule)
  },
  {
    path: 'prediagnostico-virtual',
    loadChildren: () => import('./pages/prediagnostico-virtual/prediagnostico-virtual.module').then( m => m.PrediagnosticoVirtualPageModule)
  },
  {
    path: 'administrador',
    loadChildren: () => import('./pages/administrador/administrador.module').then( m => m.AdministradorPageModule),
  },
  {
    path: 'la-clinica',
    loadChildren: () => import('./pages/la-clinica/la-clinica.module').then( m => m.LaClinicaPageModule)
  },
  {
    path: 'carrito',
    loadChildren: () => import('./pages/carrito/carrito.module').then( m => m.CarritoPageModule)
  },
  {
    path: 'kid_planet',
    loadChildren: () => import('./pages/kid-planet/kid-planet.module').then( m => m.KidPlanetPageModule)
  },
  {
    path: 'admin-equipo',
    loadChildren: () => import('./pages/admin-equipo/admin-equipo.module').then( m => m.AdminEquipoPageModule),
  },
  {
    path: 'admin-noticia',
    loadChildren: () => import('./pages/admin-noticia/admin-noticia.module').then( m => m.AdminNoticiaPageModule),
  },
  {
    path: 'admin-producto',
    loadChildren: () => import('./pages/admin-producto/admin-producto.module').then( m => m.AdminProductoPageModule),
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
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
    path: 'admin-pedidos',
    loadChildren: () => import('./pages/admin-pedidos/admin-pedidos.module').then( m => m.AdminPedidosPageModule)
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
