/** ****************************************************************************************************
 * File: index-test.js
 * @author Julian Jensen <jjdanois@gmail.com> on 27-AUG-2016
 * @version 0.0.1
 *******************************************************************************************************/
'use strict';

const
    Vector = require( '../' ),
    chai = require( 'chai' ),
    expect = chai.expect;

let vec = Vector.random( 100, 0, 10 ),
    count, flat, stillFlat, cnt;

do {
    count = 0;
    vec.each( val => !val && count++ );
} while ( !count );


describe( 'Vector', function() {

    it( 'should compact a vector', function() {
        let comped = vec.compact();

        expect( count + comped.length ).to.equal( 100 );
    } );

    it( 'should calculate an intersection', function() {
        let c1 = vec.clone(),
            c2 = Vector.clone( vec );

        expect( c1 ).to.have.length( c2.length );
        expect( c1.intersection( c2 ) ).to.have.length( c1.length );
    } );

    it( 'should create a unique vector', function() {
        expect( vec.uniq() ).to.have.length( 11 );
    } );

    it( 'should reduce a vector', function() {
        let sum = 0,
            recd = vec.reduce( ( acc, val ) => acc + val, 0 );

        vec.each( val => sum += val );

        expect( sum ).to.equal( vec.reduce( ( acc, val ) => acc + val, 0 ) );
    } );

    it( 'should flatten a vector', function() {
        let deep = new Vector( 1, 2, [ 3, 4, 5 ], 6, [ 7, [ 8, 9 ], 10 ], 11 );

        flat = deep.flatten();

        expect( deep ).to.have.length( 6 );
        expect( flat ).to.have.length( 11 );
    } );

    it( 'should push multiple values', function() {
        stillFlat = flat.push( 'A', 'B', 'C' );

        expect( flat ).to.have.length( 14 );
        expect( flat ).to.equal( stillFlat );
    } );

    it( 'should concatenate vectors', function() {
        stillFlat = flat.concat( 'A', [ 'B', 'C'  ]);

        expect( stillFlat ).to.have.length( 17 );
        expect( flat ).to.not.equal( stillFlat );
    } );

    it( 'should fill vectors with a range', function() {
        let cmp = new Vector( 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 );

        cnt = new Vector().fill( 10, 0, 10, 1 );

        expect( cnt ).to.eql( cmp );
    } );

    it( 'should retrieve the last value', function() {
        expect( cnt.last() ).to.equal( cnt[ cnt.length - 1 ] );
    } );
} );
