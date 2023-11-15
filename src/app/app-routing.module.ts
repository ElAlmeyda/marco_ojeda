import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder',
    pathMatch: 'full'
  },
  {
    path: 'contacto',
    loadChildren: () => import('./pages/contacto/contacto.module').then( m => m.ContactoPageModule)
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
    path: 'especialidad',
    loadChildren: () => import('./pages/especialidad/especialidad.module').then( m => m.EspecialidadPageModule)
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
    path: 'pide-cita',
    loadChildren: () => import('./pages/pide-cita/pide-cita.module').then( m => m.PideCitaPageModule)
  },
  {
    path: 'registrarse',
    loadChildren: () => import('./pages/registrarse/registrarse.module').then( m => m.RegistrarsePageModule)
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
    path: 'especialista/:id',
    loadChildren: () => import('./pages/especialista/especialista.module').then( m => m.EspecialistaPageModule)
  },
  {
    path: 'noticia/:id',
    loadChildren: () => import('./pages/noticia/noticia.module').then( m => m.NoticiaPageModule)
  },
  {
    path: 'administrador',
    loadChildren: () => import('./pages/administrador/administrador.module').then( m => m.AdministradorPageModule)
  },
  {
    path: 'la-clinica',
    loadChildren: () => import('./pages/la-clinica/la-clinica.module').then( m => m.LaClinicaPageModule)
  },  {
    path: 'foto-clinica',
    loadChildren: () => import('./pages/foto-clinica/foto-clinica.module').then( m => m.FotoClinicaPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
