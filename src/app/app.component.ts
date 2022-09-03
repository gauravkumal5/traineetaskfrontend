import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export default class AppComponent implements OnInit {
  constructor(private route: Router) { }
  ngOnInit(): void {

    this.route.navigate(["customers"]);
  }

  title = 'appBootstrap';
}
