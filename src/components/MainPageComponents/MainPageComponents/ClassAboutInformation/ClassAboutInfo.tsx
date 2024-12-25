'use client';
import { useState, useEffect } from 'react';
import classes from './ClassAboutInfoStyle.module.scss';
import Header from '@/components/Header/Header';
import domain from "@/app/config";



export default function ClassAboutInfo() {


  return (
    <div className={classes.wrapper}>
      <Header />
      <div className={classes.insideWrapper}>
        <div className={classes.insideBorders}>

        </div>
      </div>
    </div>
  );
}
