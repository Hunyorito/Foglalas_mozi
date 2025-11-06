import { Body, Controller, Get, Post, Render,Res,HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response } from 'express';
import path from 'path';
import fs from 'fs';


//Plusz lehetőségek
//https://retoolapi.dev/dVV4Ok/data
class movie {
  title: string;
  szabadhelyek: number;
  //foglalthelyek: number;
  helyek: number;
  id: number;
}
class movie_user {
  id: number;
  name: string;
  email: string;
  date: string | number;
  db: number | string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return { message: this.appService.getHello(), errors:[], a:{} };
  }
  @Post('/jegy')
  Movi(@Body() movie: movie_user, @Res() res: Response) {
    const error: string[] = [];
    const db= parseInt(movie.db as string);
    const now= new Date();
    const movieDate= new Date(movie.date);
    //Név
    if (!movie.name || movie.name.length < 3) {
      error.push('Név megadása kötelező!');
    }
    //Jegy darabszám
    if (movie.db==""  ) {
      error.push('Érvényes darabszám megadása kötelező!');
    }
    if(db <= 0 && db <= 10) {
      error.push('1 és 10 közötti darabszám megadása kötelező!');
    }
    //Dátum 
    if (!movie.date) {
      error.push('Dátum megadása kötelező!');
    } else
    if (movieDate < now) {
      error.push('Dátum nem lehet múltbeli!');
    }
    //Email Szófi segítet ebben
    const emailregex = /^\S+@\S+$/;
    if (!movie.email || !emailregex.test(movie.email)) {
      error.push('Érvényes email cím megadása kötelező!');
    }
    //Hibák kezelése
    if (error.length == 0) {
      const filePath = path.join(__dirname, '..', 'user.csv');
      const header = 'Név Email Dátum Darabszám\n';
      const row = `${movie.name},${movie.email},${movie.date},${movie.db}\n`;
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, header + row, 'utf-8');
      } else {
        fs.appendFileSync(filePath, row, 'utf-8');
      }
      res.redirect('/jegy');
    } else {
      res.status(HttpStatus.BAD_REQUEST).render('index', {a:movie, errors:error });
     
    }

  }
  @Get('/jegy')
  @Render('jegy')
  getJegy() {
    return {};
  }
}
