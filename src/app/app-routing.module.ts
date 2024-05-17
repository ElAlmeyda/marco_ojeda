import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';



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
    path: 'especialista/:tipo/:id',
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
  },
  {
    path: 'foto-clinica',
    loadChildren: () => import('./pages/foto-clinica/foto-clinica.module').then( m => m.FotoClinicaPageModule)
  },
  {
    path: 'carrito',
    loadChildren: () => import('./pages/carrito/carrito.module').then( m => m.CarritoPageModule)
  },
  {
    path: 'fotos/:id',
    loadChildren: () => import('./pages/fotos/fotos.module').then( m => m.FotosPageModule)
  },
  {
    path: 'producto/:id',
    loadChildren: () => import('./pages/producto/producto.module').then( m => m.ProductoPageModule)
  },
  {
    path: 'kid_planet',
    loadChildren: () => import('./pages/kid-planet/kid-planet.module').then( m => m.KidPlanetPageModule)
  },
  {
    path: 'admin-equipo',
    loadChildren: () => import('./pages/admin-equipo/admin-equipo.module').then( m => m.AdminEquipoPageModule)
  },
  {
    path: 'admin-noticia',
    loadChildren: () => import('./pages/admin-noticia/admin-noticia.module').then( m => m.AdminNoticiaPageModule)
  },
  {
    path: 'admin-producto',
    loadChildren: () => import('./pages/admin-producto/admin-producto.module').then( m => m.AdminProductoPageModule)
  },
  {
    path: 'gestor-calendario',
    loadChildren: () => import('./pages/gestor-calendario/gestor-calendario.module').then( m => m.GestorCalendarioPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'agregar-user',
    loadChildren: () => import('./pages/agregar-user/agregar-user.module').then( m => m.AgregarUserPageModule)
  },
  {
    path: 'editar-user/:id',
    loadChildren: () => import('./pages/editar-user/editar-user.module').then( m => m.EditarUserPageModule)
  },
  {
    path: 'agregar-producto',
    loadChildren: () => import('./pages/agregar-producto/agregar-producto.module').then( m => m.AgregarProductoPageModule)
  },
  {
    path: 'editar-producto/:id',
    loadChildren: () => import('./pages/editar-producto/editar-producto.module').then( m => m.EditarProductoPageModule)
  },
  {
    path: 'agregar-noticia',
    loadChildren: () => import('./pages/agregar-noticia/agregar-noticia.module').then( m => m.AgregarNoticiaPageModule)
  },
  {
    path: 'editar-noticia/:id',
    loadChildren: () => import('./pages/editar-noticia/editar-noticia.module').then( m => m.EditarNoticiaPageModule)
  },
  {
    path: 'editar-calendario/:id',
    loadChildren: () => import('./pages/editar-calendario/editar-calendario.module').then( m => m.EditarCalendarioPageModule)
  },
  {
    path: 'gestor',
    loadChildren: () => import('./pages/gestor/gestor.module').then( m => m.GestorPageModule)
  },
  {
    path: 'dia',
    loadChildren: () => import('./pages/dia/dia.module').then( m => m.DiaPageModule)
  }







];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
