/** ****************************************************************************************************
 *
 * A much faster and versatile array class.
 *
 * File: index.js
 * @author Julian Jensen <jjdanois@gmail.com> on 27-AUG-2016
 * @version 0.7.1
 *******************************************************************************************************/
'use strict';

/**
 * @param subject
 * @param value
 * @param start
 * @param end
 * @return {*}
 */
function fill( subject, value, start, end )
{
    var length = subject.length,
        i;
    if ( start === undefined )
        start = 0;

    if ( end === undefined )
        end = length;

    for ( i = start; i < end; i++ )
        subject[ i ] = value;

    return subject;
}

/**
 * @param subject
 * @param target
 * @param fromIndex
 * @return {number}
 */
function indexOf( subject, target, fromIndex )
{
    var length = subject.length,
        i      = 0;

    if ( typeof fromIndex === 'number' )
    {
        i = fromIndex;

        if ( i < 0 )
        {
            i += length;
            if ( i < 0 ) i = 0;
        }
    }

    for ( ; i < length; i++ )
    {
        if ( subject[ i ] === target )
            return i;
    }

    return -1;
}

const
    iterable         = a => !!a && typeof a[ Symbol.iterator ] === 'function',
    LARGE_ARRAY_SIZE = 200;

/** */
class Vector extends Array
{
    /**
     * @param args
     */
    constructor( ...args )
    {
        if ( args.length === 1 && Array.isArray( args[ 0 ] ) )
        {
            const
                input  = args[ 0 ],
                length = input.length;
            super( length );

            let i = -1;

            while ( ++i < length )
                this[ i ] = input[ i ];
        }
        else if ( args.length === 1 && typeof args[ 0 ] === 'number' )
            super( args[ 0 ] );
        else if ( args.length )
        {
            const
                length = args.length;
            super( length );

            let i = -1;

            while ( ++i < length )
                this[ i ] = args[ i ];
        }
        else
            super();
    }

    /**
     * @param fn
     * @param thisContext
     * @return {Vector}
     */
    each( fn, thisContext )
    {
        const iterator = thisContext !== undefined ? fn.bind( thisContext ) : fn;

        let index  = -1,
            length = this.length;

        while ( ++index < length )
            iterator( this[ index ], index, this );

        return this;
    }

    /**
     * @param fn
     * @return {Function}
     */
    static each( fn )
    {
        return function( arr ) {
            arr = arr instanceof Vector || Array.isArray( arr ) ? arr : iterable( arr ) ? Array.from( arr ) : [ arr ];

            const
                length = arr ? arr.length : 0;

            let index = -1;

            while ( ++index < length )
                fn( arr[ index ], index, arr );

            return arr;
        };
    }

    /**
     * @param fn
     * @param thisContext
     * @return {Vector}
     */
    map( fn, thisContext )
    {
        const
            length   = this.length,
            result   = new Vector( length ),
            iterator = thisContext !== undefined ? fn.bind( thisContext ) : fn;

        let i = -1;

        while ( ++i < length )
            result[ i ] = iterator( this[ i ], i, this );

        return result;
    }

    /**
     * @param fn
     * @return {Function}
     */
    static map( fn )
    {
        return function( arr ) {
            arr = arr instanceof Vector || Array.isArray( arr ) ? arr : iterable( arr ) ? Vector.from( arr ) : arr !== undefined ? new Vector().push( arr ) : new Vector();

            const
                length = arr.length,
                result = new Vector( arr.length );

            let index = -1;

            while ( ++index < length )
                result[ index ] = fn( arr[ index ], index, arr );

            return result;
        };
    }

    /**
     * @param fn
     * @param initialValue
     * @param thisContext
     * @return {*}
     */
    reduce( fn, initialValue, thisContext )
    {
        const
            length   = this.length,
            iterator = thisContext !== undefined ? fn.bind( thisContext ) : fn;

        let i = 0, result;

        if ( initialValue === undefined )
        {
            i = 1;
            result = this[ 0 ];
        }
        else
            result = initialValue;

        for ( ; i < length; i++ )
            result = iterator( result, this[ i ], i, this );

        return result;
    }

    /**
     * @param fn
     * @return {Function}
     */
    static reduce( fn )
    {
        return function( arr, initialValue ) {
            arr = arr instanceof Vector || Array.isArray( arr ) ? arr : iterable( arr ) ? Vector.from( arr ) : arr !== undefined ? new Vector().push( arr ) : new Vector();

            const
                length = arr.length;

            let i = 0, result;

            if ( arguments.length === 1 )
            {
                i = 1;
                result = arr[ 0 ];
            }
            else
                result = initialValue;

            for ( ; i < length; i++ )
                result = fn( result, arr[ i ], i, arr );

            return result;
        };
    }

    /**
     * @param fn
     * @param initialValue
     * @param thisContext
     * @return {*}
     */
    reduceRight( fn, initialValue, thisContext )
    {
        const
            length   = this.length,
            iterator = thisContext !== undefined ? fn.bind( thisContext ) : fn;

        let i = length - 1, result;

        if ( initialValue === undefined )
            result = i >= 0 ? this[ i-- ] : undefined;
        else
            result = initialValue;

        for ( ; i >= 0; i-- )
            result = iterator( result, this[ i ], i, this );

        return result;
    }

    /**
     * @param args
     * @return {*}
     */
    concat( ...args )
    {
        const
            length = args.length,
            arr    = Vector.from( this );

        let i = -1, index = this.length;

        while ( ++i < length )
        {
            let item = args[ i ];

            if ( Array.isArray( item ) )
            {
                let childLength = item.length,
                    j           = -1;

                while ( ++j < childLength )
                    arr[ index + j ] = item[ j ];

                index += childLength;
            }
            else
                arr[ index++ ] = item;
        }

        return arr;
    }

    /**
     * @param args
     * @return {Vector}
     */
    push( ...args )
    {
        const
            length = args.length;

        let index = this.length,
            i     = -1;

        while ( ++i < length )
            this[ index + i ] = args[ i ];

        return this;
    }

    /**
     * @return {*}
     */
    pop()
    {
        const val = this.length > 0 ? this[ this.length - 1 ] : undefined;

        if ( this.length > 0 ) this.length--;

        return val;
    }

    /**
     * @param args
     * @return {Vector}
     */
    unshift( ...args )
    {
        this.splice( 0, 0, ...args );

        return this;
    }

    /**
     * @return {Vector}
     */
    clone()
    {
        const
            length = this.length,
            sliced = new Vector( length );

        let i = -1;

        while ( ++i < length )
            sliced[ i ] = this[ i ];

        return sliced;
    }

    /**
     * @param input
     * @return {Vector}
     */
    static clone( input )
    {
        const
            length = input.length,
            sliced = new Vector( length );

        let i = -1;

        while ( ++i < length )
            sliced[ i ] = input[ i ];

        return sliced;
    }

    /**
     * @param fn
     * @param thisContext
     * @return {boolean}
     */
    every( fn, thisContext )
    {
        const
            length   = this.length,
            iterator = thisContext !== undefined ? fn.bind( thisContext ) : fn;

        let i = -1;

        while ( ++i < length )
            if ( !iterator( this[ i ], i, this ) ) return false;

        return true;
    }

    /**
     * @param fn
     * @param thisContext
     * @return {boolean}
     */
    some( fn, thisContext )
    {
        const
            length   = this.length,
            iterator = thisContext !== undefined ? fn.bind( thisContext ) : fn;

        let i = -1;

        while ( ++i < length )
            if ( iterator( this[ i ], i, this ) ) return true;

        return false;
    }

    /**
     * @param slice
     * @param sliceEnd
     * @return {Vector}
     */
    slice( slice, sliceEnd )
    {
        const ret = new Vector();

        let len = this.length;

        if ( len === 0 ) return ret;

        const start = slice < 0 ? Math.max( 0, slice + len ) : slice || 0;

        if ( sliceEnd !== undefined )
            len = sliceEnd < 0 ? sliceEnd + len : sliceEnd;

        while ( len-- > start )
            ret[ len - start ] = this[ len ];

        return ret;
    }

    /**
     * @param value
     * @param start
     * @param end
     * @param _dir
     * @return {*}
     */
    fill( value, start, end, _dir )
    {
        var i,
            arr    = this,
            length = arr.length;

        if ( !_dir ) return fill( this, value, start, end );

        if ( start === undefined ) start = 0;

        if ( end === undefined ) end = length;

        for ( i = start; i < end; i++, value += _dir )
            arr[ i ] = value;

        return this;
    }

    /**
     * @param value
     * @return {boolean}
     */
    includes( value )
    {
        if ( Array.isArray( value ) )
        {
            const _includes = this.includes.bind( this );

            return this.some( _includes );
        }

        return this.indexOf( value ) !== -1;
    }

    /**
     * @param target
     * @param fromIndex
     * @return {number}
     */
    indexOf( target, fromIndex )
    {
        return indexOf( this, target, fromIndex );
    }

    /**
     * @param target
     * @param fromIndex
     * @return {number}
     */
    lastIndexOf( target, fromIndex )
    {
        const
            length = this.length;

        let i = length - 1;

        if ( typeof fromIndex === 'number' )
        {
            i = fromIndex;
            if ( i < 0 ) i += length;
        }

        for ( ; i >= 0; i-- )
            if ( this[ i ] === target ) return i;

        return -1;
    }

    /**
     * @param fields
     * @return {Vector}
     */
    pluck( ...fields )
    {
        const
            length  = this.length,
            plucked = new Vector();

        let count = 0, value, i = -1;

        while ( ++i < length )
        {
            value = this[ i ];

            if ( typeof value === 'object' && !!value && !Array.isArray( value ) )
                plucked[ count++ ] = fields.length === 1 ? value[ fields[ 0 ] ] : fields.map( f => value[ f ] );
        }

        return plucked;
    }

    /**
     * @param set
     * @return {Vector}
     * @private
     */
    _setToArray( set )
    {
        let index  = -1,
            result = new Vector( set.size );

        set.forEach( value => result[ ++index ] = value );

        return result;
    }

    /**
     * @param comparator
     * @return {Vector}
     */
    uniq( comparator )
    {
        let index = -1;

        const
            length = this.length,
            result = new Vector();

        if ( length >= LARGE_ARRAY_SIZE && !comparator )
            return this._setToArray( new Set( this ) );

        outer:
            while ( ++index < length )
            {
                const
                    value = this[ index ];

                let seenIndex = result.length;

                while ( seenIndex-- )
                    if ( comparator ? comparator( result[ seenIndex ], value ) : result[ seenIndex ] === value ) continue outer;

                result[ result.length ] = value;
            }

        return result;
    }

    /**
     * @param deep
     * @return {*}
     */
    flatten( deep = true )
    {
        const
            length = this.length;

        if ( !length ) return new Vector();

        return Vector._flatten( this, deep );
    }

    /**
     * @param arr
     * @param deep
     * @param result
     * @return {Vector}
     * @private
     */
    static _flatten( arr, deep = true, result = new Vector() )
    {
        const
            length = arr.length;

        if ( !length ) return result;

        let index = -1;

        while ( ++index < length )
        {
            let value = arr[ index ];

            if ( value instanceof Vector || Array.isArray( value ) )
            {
                if ( deep )
                    Vector._flatten( value, deep, result );
                else
                    result.push( ...value );
            }
            else
                result[ result.length ] = value;
        }

        return result;
    }

    /**
     * @return {*}
     */
    last()
    {
        const length = this.length - 1;

        return length === -1 ? undefined : this[ length ];
    }

    /**
     * @param arrs
     * @return {Vector}
     */
    union( ...arrs )
    {
        return this.concat( ...arrs ).uniq();
    }

    /**
     * @param arrs
     * @return {Vector}
     */
    intersection( ...arrs )
    {
        arrs[ arrs.length ] = this;

        let shortest = 0;

        Vector.each( ( a, i ) => a.length < arrs[ shortest ].length && ( shortest = i ) )( arrs );

        let index       = -1,
            resultIndex = 0,
            main        = arrs[ shortest ];

        const
            result = new Vector(),
            length = main.length;

        skip:
            while ( ++index < length )
            {
                let j           = -1,
                    childLength = arrs.length,
                    value       = main[ index ];

                while ( ++j < childLength )
                    if ( j !== shortest && !arrs[ j ].includes( value ) ) continue skip;

                result[ resultIndex++ ] = value;
            }

        return result;
    }

    /**
     * @param arr
     * @return {boolean}
     */
    equals( arr )
    {
        const
            length = this.length;

        if ( length !== arr.length ) return false;

        const
            self  = this.sort(),
            other = arr.sort();

        let i = -1;

        while ( ++i < length )
            if ( self[ i ] !== other[ i ] ) return false;

        return true;
    }

    /**
     * @param hint
     * @return {*}
     */
    [ Symbol.toPrimitive ]( hint )
    {
        if ( hint === 'number' ) return this.length;
        else if ( hint === 'string' ) return '[ ' + this.join( ', ' ) + ' ]';

        return !!this.length;
    }

    /**
     * @param inPlace
     * @return {Vector}
     */
    compact( inPlace = false )
    {
        const
            result = inPlace ? this : new Vector(),
            length = this.length;

        let resultIndex = 0,
            index       = -1;

        while ( ++index < length )
            if ( this[ index ] ) result[ resultIndex++ ] = this[ index ];

        if ( inPlace ) result.length = resultIndex;

        return result;
    }

    /**
     * @param arg
     * @return {Vector}
     */
    static from( arg )
    {
        if ( iterable( arg ) )
            return Vector.clone( Array.from( arg ) );
        else
            return new Vector().push( arg );
    }

    /**
     * @param arg
     * @return {boolean}
     */
    static array( arg )
    {
        return Array.isArray( arg );
    }

    /**
     * @param count
     * @param min
     * @param max
     * @param float
     * @return {Vector}
     */
    static random( count, min = 0, max = 1, float = false )
    {
        const
            a      = new Vector( count ),
            length = count,
            _min   = min < max ? min : max,
            _max   = max > min ? max : min,
            range  = _max - _min + 1;

        let i = -1, val;

        while ( ++i < length )
        {
            val = Math.random() * range;
            if ( !float ) val |= 0;
            a[ i ] = val + _min;
        }

        return a;
    }

    /**
     */
    static override()
    {
        require( './proto' );
    }
}

Vector.prototype.forEach = Vector.prototype.each;
Vector.forEach = Vector.each;
Vector.prototype.any = Vector.prototype.some;
Vector.prototype.all = Vector.prototype.every;

module.exports = Vector;
