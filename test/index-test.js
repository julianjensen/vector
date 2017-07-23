/** ****************************************************************************************************
 * File: index-test.js
 * @author Julian Jensen <jjdanois@gmail.com> on 27-AUG-2016
 * @version 0.0.1
 *******************************************************************************************************/
'use strict';

const
    Vector = require( '../index' ),
    expect = require( 'chai' ).expect;

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

    it( 'should fill an array', function() {
        const loc = new Vector( 10 ).fill( 100 );

        expect( loc ).to.have.length( 10 );
        expect( loc ).to.eql( [ 100, 100, 100, 100, 100, 100, 100, 100, 100, 100 ] );
    } );

    it( 'should find an index', function() {
        const idx = new Vector( [ 1, 2, 3, 4, 5, 6, 7, 2, 9, 10 ] );

        expect( idx.lastIndexOf( 99 ) ).to.equal( -1 );
        expect( idx.indexOf( 3, 1 ) ).to.equal( 2 );
        expect( idx.indexOf( 3, 4 ) ).to.equal( -1 );
        expect( idx.indexOf( 3, -9 ) ).to.equal( 2 );
        expect( idx.indexOf( 3, -90 ) ).to.equal( 2 );
        expect( idx.lastIndexOf( 2 ) ).to.equal( 7 );
        expect( idx.lastIndexOf( 2, -2 ) ).to.equal( 7 );
    } );

    it( 'should map things', function() {
        const
            loc = new Vector( 1, 2, 3, 4, 5 ),
            ctx = { mult: 2 },
            multer = Vector.map( v => v * 2 );

        expect( loc.map( v => v * 2 ) ).to.eql( [ 2, 4, 6, 8, 10 ] );
        expect( loc.map( function( v ) { return v * this.mult; }, ctx ) ).to.eql( [ 2, 4, 6, 8, 10 ] );
        expect( multer( loc ) ).to.eql( [ 2, 4, 6, 8, 10 ] );
        expect( multer( [ 1, 2, 3, 4, 5 ] ) ).to.eql( [ 2, 4, 6, 8, 10 ] );
        expect( multer( new Set( [ 1, 2, 3, 4, 5 ] ) ) ).to.eql( [ 2, 4, 6, 8, 10 ] );
        expect( multer() ).to.eql( [] );
    } );

    it( 'should reduce things', function() {
        const
            loc = new Vector( 1, 2, 3, 4, 5 ),
            ctx = { mult: 2 },
            multer = Vector.reduce( ( acc, v ) => acc + v );

        expect( loc.reduce( ( acc, v ) => acc + v, 0 ) ).to.eql( 15 );
        expect( loc.reduce( function( acc, v ) { return acc + this.mult * v; }, 0, ctx ) ).to.eql( 30 );
        expect( multer( loc, 0 ) ).to.eql( 15 );
        expect( multer( loc ) ).to.eql( 15 );
        expect( multer( [ 1 ], 0 ) ).to.eql( 1 );
        expect( multer( new Set( [ 1, 2, 3, 4, 5 ] ), 0 ) ).to.eql( 15 );
        expect( loc.reduce( ( acc, v ) => acc + v ) ).to.eql( 15 );

        expect( loc.reduceRight( ( acc, v ) => acc + v, 0 ) ).to.eql( 15 );
        expect( loc.reduceRight( function( acc, v ) { return acc + this.mult * v; }, 0, ctx ) ).to.eql( 30 );
        expect( loc.reduceRight( ( acc, v ) => acc + v ) ).to.eql( 15 );

    } );

    it( 'should have a push and pop that makes sense', function() {
        const loc = new Vector( 1, 2, 3, 4, 5 );

        expect( loc.push( 6 ) ).to.eql( [ 1, 2, 3, 4, 5, 6 ] );
        expect( loc.pop() ).to.equal( 6 );
        expect( loc.unshift( 0 ) ).to.eql( [ 0, 1, 2, 3, 4, 5 ] );
        expect( loc.shift() ).to.equal( 0 );

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

        expect( sum ).to.equal( recd );
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

    it( 'should do some logical checks on values', function() {
        const list = new Vector( 1, 2, 3, 4, 5 );

        expect( list.every( ( v, i ) => v === i + 1 ) ).to.be.true;
        expect( list.all( ( v, i ) => v === i + 1 ) ).to.be.true;

        expect( list.some( ( v, i ) => v === 2 ) ).to.be.true;
        expect( list.any( ( v, i ) => v === 2 ) ).to.be.true;
    } );

    it( "should pluck 'em good, pluck 'em real good", () => {
        const test = new Vector( [
            { first: 'one', second: 'two', last: 'three' },
            { first: 'one', second: 'two', last: 'three' },
            { first: 'one', second: 'two', last: 'three' },
            { first: 'one', last: 'three' }
        ] );

        expect( test.pluck( 'first' ) ).to.eql( [ 'one', 'one', 'one', 'one' ] );
        expect( test.pluck( 'first', 'last' ) ).to.eql( [ [ 'one', 'three' ], [ 'one', 'three' ], [ 'one', 'three' ], [ 'one', 'three' ] ] );
        expect( test.pluck( 'first', 'second' ) ).to.eql( [ [ 'one', 'two' ], [ 'one', 'two' ], [ 'one', 'two' ], [ 'one', undefined ] ] );
    } );

    it( 'should force unique and flat values', () => {
        const test = new Vector( [ 1, 2, 3, 4, 3, 5, 5 ] ),
              nested = new Vector( [ 1, 2, [ 3, [ 4, 5 ], 6 ], 7 ] ),
              left = new Vector( [ 1, 2, 3, 4 ] ),
              right = new Vector( [ 3, 4, 5, 6 ] ),
              same = new Vector( [ 1, 2, 3, 4 ] ),
              big = new Vector();

        for ( let n = 0; n < 400; n++ )
            big[ n ] = n;

        big[ 399 ] = 1;

        expect( big ).to.have.length( 400 );
        expect( big.uniq() ).to.have.length( 399 );

        expect( test.uniq() ).to.eql( [ 1, 2, 3, 4, 5 ] );
        expect( nested.flatten() ).to.eql( [ 1, 2, 3, 4, 5, 6, 7 ] );
        expect( nested.flatten( false ) ).to.eql( [ 1, 2, 3, [ 4, 5 ], 6, 7 ] );
        expect( new Vector().flatten() ).to.eql( [] );

        expect( left.union( right ) ).to.eql( [ 1, 2, 3, 4, 5, 6 ] );
        expect( left.equals( right ) ).to.be.false;
        expect( left.equals( same ) ).to.be.true;

        expect( Number( same ) ).to.equal( 4 );
        expect( String( same ) ).to.equal( '[ 1, 2, 3, 4 ]' );
        expect( same + 0 ).to.equal( 1 );
    } );

    it( 'should do some misc stuff', function() {
        expect( new Vector( 'hello' ) ).to.have.length( 1 );
        expect( Vector.from( 1 ) ).to.have.length( 1 );
        expect( Vector.array( [] ) ).to.be.true;

        Vector.override();
        expect( typeof [].uniq ).to.eql( 'function' );
    } );
} );
